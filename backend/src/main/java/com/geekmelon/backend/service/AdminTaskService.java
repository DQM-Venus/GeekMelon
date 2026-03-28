package com.geekmelon.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.geekmelon.backend.config.GeekMelonProperties;
import com.geekmelon.backend.dto.AdminTaskPreviewItemResponse;
import com.geekmelon.backend.dto.AdminTaskPreviewResponse;
import com.geekmelon.backend.dto.AdminTaskRunLogResponse;
import com.geekmelon.backend.entity.AdminSourceConfig;
import com.geekmelon.backend.entity.AdminTaskRunLog;
import com.geekmelon.backend.exception.BizException;
import com.geekmelon.backend.repository.AdminTaskRunLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
public class AdminTaskService {

    private static final String ERROR_SOURCE_FETCH = "SOURCE_FETCH";
    private static final String ERROR_PUBLISH_WINDOW = "PUBLISH_WINDOW";
    private static final String ERROR_ANALYZE_NETWORK = "ANALYZE_NETWORK";
    private static final String ERROR_ANALYZE_PARSE = "ANALYZE_PARSE";
    private static final String ERROR_PUBLISH_REQUEST = "PUBLISH_REQUEST";
    private static final String ERROR_PROCESS_EXIT = "PROCESS_EXIT";
    private static final String ERROR_UNEXPECTED = "UNEXPECTED";
    private static final AtomicBoolean RUNNING = new AtomicBoolean(false);

    private final GeekMelonProperties properties;
    private final AdminSourceService adminSourceService;
    private final AdminTaskRunLogRepository adminTaskRunLogRepository;
    private final ObjectMapper objectMapper;

    public AdminTaskService(
            GeekMelonProperties properties,
            AdminSourceService adminSourceService,
            AdminTaskRunLogRepository adminTaskRunLogRepository,
            ObjectMapper objectMapper
    ) {
        this.properties = properties;
        this.adminSourceService = adminSourceService;
        this.adminTaskRunLogRepository = adminTaskRunLogRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional(readOnly = true)
    public List<AdminTaskRunLogResponse> listRuns() {
        return adminTaskRunLogRepository.findTop20ByOrderByStartedAtDescIdDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AdminTaskRunLogResponse> listRecentRuns(int limit) {
        return adminTaskRunLogRepository.findTop20ByOrderByStartedAtDescIdDesc()
                .stream()
                .limit(limit)
                .map(this::toResponse)
                .toList();
    }

    public AdminTaskRunLogResponse triggerManualCollect(String sourceKey) {
        AdminSourceConfig sourceConfig = adminSourceService.getRequiredSource(sourceKey);
        if (!Boolean.TRUE.equals(sourceConfig.getEnabled())) {
            throw new BizException(400, "该来源已禁用，无法手动抓取");
        }

        AdminSourceCatalog.ManagedSourceDefinition definition = getRequiredDefinition(sourceKey);
        if (!RUNNING.compareAndSet(false, true)) {
            throw new BizException(400, "当前已有抓取任务在运行，请稍后再试");
        }

        String runId = UUID.randomUUID().toString();
        AdminTaskRunLog log = new AdminTaskRunLog();
        log.setRunId(runId);
        log.setSourceKey(sourceKey);
        log.setTriggerType("manual");
        log.setStatus("running");
        log.setStartedAt(LocalDateTime.now());
        log.setCreatedCount(0);
        log.setUpdatedCount(0);
        log.setSkippedCount(0);
        log.setFilteredCount(0);
        log = adminTaskRunLogRepository.save(log);

        try {
            ProcessBuilder processBuilder = buildCrawlerProcess(definition.commandSource(), false);
            processBuilder.redirectErrorStream(true);
            applyBaseEnvironment(processBuilder, runId);
            applyEditorialEnvironment(processBuilder);
            applySourceEnvironment(processBuilder, sourceConfig);

            Process process = processBuilder.start();
            List<String> outputLines = readOutput(process);
            int exitCode = process.waitFor();

            TaskRunSummary summary = summarize(outputLines);
            log.setEndedAt(LocalDateTime.now());
            log.setCreatedCount(summary.createdCount());
            log.setUpdatedCount(summary.updatedCount());
            log.setSkippedCount(summary.skippedCount());
            log.setFilteredCount(summary.filteredCount());
            log.setStatus(exitCode == 0 ? "success" : "failed");
            if (exitCode != 0) {
                log.setErrorCategory(summary.errorCategory() != null ? summary.errorCategory() : ERROR_PROCESS_EXIT);
                log.setErrorDetail(limitText(
                        summary.errorDetail() != null ? summary.errorDetail() : String.join("\n", outputLines),
                        1000
                ));
            } else {
                log.setErrorCategory(summary.errorCategory());
                log.setErrorDetail(limitText(summary.errorDetail(), 1000));
            }
            return toResponse(adminTaskRunLogRepository.save(log));
        } catch (IOException exception) {
            log.setEndedAt(LocalDateTime.now());
            log.setStatus("failed");
            log.setErrorCategory(ERROR_UNEXPECTED);
            log.setErrorDetail(limitText(exception.getMessage(), 1000));
            return toResponse(adminTaskRunLogRepository.save(log));
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            log.setEndedAt(LocalDateTime.now());
            log.setStatus("failed");
            log.setErrorCategory(ERROR_PROCESS_EXIT);
            log.setErrorDetail("抓取任务被中断");
            return toResponse(adminTaskRunLogRepository.save(log));
        } finally {
            RUNNING.set(false);
        }
    }

    public AdminTaskPreviewResponse previewSource(String sourceKey) {
        AdminSourceCatalog.ManagedSourceDefinition definition = getRequiredDefinition(sourceKey);
        AdminSourceConfig sourceConfig = adminSourceService.getRequiredSource(sourceKey);

        String runId = UUID.randomUUID().toString();
        try {
            ProcessBuilder processBuilder = buildCrawlerProcess(definition.commandSource(), true);
            processBuilder.redirectErrorStream(true);
            applyBaseEnvironment(processBuilder, runId);
            applySourceEnvironment(processBuilder, sourceConfig);
            processBuilder.environment().put("GM_ENABLE_DEEPSEEK", "false");

            Process process = processBuilder.start();
            List<String> outputLines = readOutput(process);
            int exitCode = process.waitFor();
            if (exitCode != 0) {
                TaskRunSummary summary = summarize(outputLines);
                throw new BizException(
                        500,
                        summary.errorDetail() != null ? summary.errorDetail() : "预览抓取失败"
                );
            }

            PreviewSummary preview = summarizePreview(outputLines, sourceKey, runId);
            return new AdminTaskPreviewResponse(
                    preview.sourceKey(),
                    preview.runId(),
                    preview.previewCount(),
                    preview.filteredCount(),
                    preview.items()
            );
        } catch (IOException exception) {
            throw new BizException(500, "预览抓取失败：" + exception.getMessage());
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new BizException(500, "预览抓取被中断");
        }
    }

    private AdminSourceCatalog.ManagedSourceDefinition getRequiredDefinition(String sourceKey) {
        AdminSourceCatalog.ManagedSourceDefinition definition = AdminSourceCatalog.find(sourceKey);
        if (definition == null) {
            throw new BizException(404, "来源不存在");
        }
        return definition;
    }

    private String resolvePythonCommand() {
        if (properties.crawler() == null || properties.crawler().pythonCommand() == null) {
            return "python";
        }
        return properties.crawler().pythonCommand();
    }

    private Path resolveCrawlerWorkingDirectory() {
        String rawDirectory = properties.crawler() == null ? "../crawler" : properties.crawler().workingDirectory();
        return Path.of(rawDirectory).normalize().toAbsolutePath();
    }

    private String resolveCrawlerRunnerMode() {
        if (properties.crawler() == null || properties.crawler().runnerMode() == null || properties.crawler().runnerMode().isBlank()) {
            return "local";
        }
        return properties.crawler().runnerMode().trim().toLowerCase();
    }

    private String resolveCrawlerApiBaseUrl() {
        if (properties.crawler() == null || properties.crawler().apiBaseUrl() == null || properties.crawler().apiBaseUrl().isBlank()) {
            return "http://127.0.0.1:8080";
        }
        return properties.crawler().apiBaseUrl().trim();
    }

    private String resolveIngestToken() {
        if (properties.ingest() == null || properties.ingest().token() == null || properties.ingest().token().isBlank()) {
            return "geekmelon-dev-token";
        }
        return properties.ingest().token();
    }

    private void applyBaseEnvironment(ProcessBuilder processBuilder, String runId) {
        processBuilder.environment().put("PYTHONIOENCODING", "UTF-8");
        processBuilder.environment().put("GM_INGEST_TOKEN", resolveIngestToken());
        processBuilder.environment().put("GM_API_BASE_URL", resolveCrawlerApiBaseUrl());
        processBuilder.environment().put("GM_RUN_ID", runId);
    }

    private void applyEditorialEnvironment(ProcessBuilder processBuilder) {
        if (properties.editorial() == null) {
            return;
        }

        processBuilder.environment().put("GM_ENABLE_DEEPSEEK", String.valueOf(properties.editorial().enabled()));
        processBuilder.environment().put(
                "GM_DEEPSEEK_REQUEST_TIMEOUT_SECONDS",
                String.valueOf(properties.editorial().requestTimeoutSeconds())
        );

        if (properties.editorial().apiKey() != null && !properties.editorial().apiKey().isBlank()) {
            processBuilder.environment().put("DEEPSEEK_API_KEY", properties.editorial().apiKey());
        }
        if (properties.editorial().baseUrl() != null && !properties.editorial().baseUrl().isBlank()) {
            processBuilder.environment().put("GM_DEEPSEEK_BASE_URL", properties.editorial().baseUrl());
        }
        if (properties.editorial().model() != null && !properties.editorial().model().isBlank()) {
            processBuilder.environment().put("GM_DEEPSEEK_MODEL", properties.editorial().model());
        }
    }

    private void applySourceEnvironment(ProcessBuilder processBuilder, AdminSourceConfig sourceConfig) {
        String sourceKey = sourceConfig.getSourceKey();
        int maxItems = Math.max(1, sourceConfig.getMaxItems());
        switch (sourceKey) {
            case "cls" -> processBuilder.environment().put("GM_CLS_AI_MAX_ITEMS", String.valueOf(maxItems));
            case "qbitai" -> processBuilder.environment().put("GM_QBITAI_MAX_ITEMS", String.valueOf(maxItems));
            case "toutiao" -> processBuilder.environment().put("GM_TOUTIAO_HOT_MAX_ITEMS", String.valueOf(maxItems));
            case "juejin" -> processBuilder.environment().put("GM_JUEJIN_AI_MAX_ITEMS", String.valueOf(maxItems));
            case "jiqizhixin" -> processBuilder.environment().put("GM_JIQIZHIXIN_MAX_ITEMS", String.valueOf(maxItems));
            case "aibase" -> processBuilder.environment().put("GM_AIBASE_MAX_ITEMS", String.valueOf(maxItems));
            case "zhidx" -> processBuilder.environment().put("GM_ZHIDX_MAX_ITEMS", String.valueOf(maxItems));
            case "kr36" -> {
                int hotItems = Math.max(1, (maxItems + 1) / 2);
                int flashItems = Math.max(1, maxItems - hotItems);
                processBuilder.environment().put("GM_36KR_MAX_HOT_ITEMS", String.valueOf(hotItems));
                processBuilder.environment().put("GM_36KR_MAX_FLASH_ITEMS", String.valueOf(flashItems));
            }
            default -> {
            }
        }
    }

    private ProcessBuilder buildCrawlerProcess(String commandSource, boolean previewMode) {
        String runnerMode = resolveCrawlerRunnerMode();
        List<String> command = new ArrayList<>();
        command.add(resolvePythonCommand());

        if ("embedded".equals(runnerMode)) {
            command.add("/app/crawler/main.py");
        } else {
            command.add("main.py");
        }
        command.add("--source");
        command.add(commandSource);
        if (previewMode) {
            command.add("--preview");
        }

        ProcessBuilder processBuilder = new ProcessBuilder(command);
        if ("embedded".equals(runnerMode)) {
            processBuilder.directory(Path.of("/app/crawler").toFile());
        } else {
            processBuilder.directory(resolveCrawlerWorkingDirectory().toFile());
        }
        return processBuilder;
    }

    private List<String> readOutput(Process process) throws IOException {
        List<String> lines = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8)
        )) {
            String line;
            while ((line = reader.readLine()) != null) {
                lines.add(line);
            }
        }
        return lines;
    }

    private TaskRunSummary summarize(List<String> outputLines) {
        int created = 0;
        int updated = 0;
        int skipped = 0;
        int filtered = 0;
        String errorCategory = null;
        String errorDetail = null;

        for (String line : outputLines) {
            StructuredLogEvent event = parseStructuredEvent(line);
            if (event == null) {
                continue;
            }

            switch (event.event()) {
                case "publish_result" -> {
                    switch (event.action()) {
                        case "created" -> created += event.count();
                        case "updated" -> updated += event.count();
                        case "skipped" -> skipped += event.count();
                        default -> {
                        }
                    }
                }
                case "item_filtered", "publish_window_filtered" -> filtered += event.count();
                case "error" -> {
                    if (errorCategory == null) {
                        errorCategory = event.errorCategory();
                    }
                    if (errorDetail == null) {
                        errorDetail = event.message();
                    }
                }
                default -> {
                }
            }
        }

        return new TaskRunSummary(created, updated, skipped, filtered, errorCategory, errorDetail);
    }

    private PreviewSummary summarizePreview(List<String> outputLines, String sourceKey, String defaultRunId) {
        String runId = defaultRunId;
        int previewCount = 0;
        int filteredCount = 0;
        List<AdminTaskPreviewItemResponse> items = List.of();

        for (String line : outputLines) {
            JsonNode root = parseJson(line);
            if (root == null || !"preview_result".equals(textValue(root, "event"))) {
                continue;
            }

            runId = textValue(root, "run_id") != null ? textValue(root, "run_id") : runId;
            previewCount = root.path("preview_count").asInt(0);
            filteredCount = root.path("filtered_count").asInt(0);
            if (root.has("items") && root.get("items").isArray()) {
                items = objectMapper.convertValue(
                        root.get("items"),
                        new TypeReference<List<AdminTaskPreviewItemResponse>>() {
                        }
                );
            }
        }

        return new PreviewSummary(sourceKey, runId, previewCount, filteredCount, items);
    }

    private StructuredLogEvent parseStructuredEvent(String line) {
        JsonNode root = parseJson(line);
        if (root == null || !root.isObject()) {
            return null;
        }

        String event = textValue(root, "event");
        if (event == null) {
            return null;
        }

        int count = root.path("count").canConvertToInt() ? Math.max(1, root.path("count").asInt()) : 1;
        return new StructuredLogEvent(
                event,
                textValue(root, "action"),
                count,
                textValue(root, "error_category"),
                textValue(root, "message")
        );
    }

    private JsonNode parseJson(String line) {
        if (line == null || line.isBlank()) {
            return null;
        }
        try {
            JsonNode root = objectMapper.readTree(line);
            return root.isObject() ? root : null;
        } catch (IOException exception) {
            return null;
        }
    }

    private String textValue(JsonNode root, String fieldName) {
        String value = root.path(fieldName).asText(null);
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private String limitText(String text, int maxLength) {
        if (text == null) {
            return null;
        }
        return text.length() <= maxLength ? text : text.substring(0, maxLength);
    }

    private AdminTaskRunLogResponse toResponse(AdminTaskRunLog entity) {
        return new AdminTaskRunLogResponse(
                entity.getId(),
                entity.getRunId(),
                entity.getSourceKey(),
                entity.getTriggerType(),
                entity.getStatus(),
                entity.getStartedAt(),
                entity.getEndedAt(),
                entity.getCreatedCount(),
                entity.getUpdatedCount(),
                entity.getSkippedCount(),
                entity.getFilteredCount(),
                entity.getErrorCategory(),
                entity.getErrorDetail()
        );
    }

    private record TaskRunSummary(
            int createdCount,
            int updatedCount,
            int skippedCount,
            int filteredCount,
            String errorCategory,
            String errorDetail
    ) {
    }

    private record PreviewSummary(
            String sourceKey,
            String runId,
            int previewCount,
            int filteredCount,
            List<AdminTaskPreviewItemResponse> items
    ) {
    }

    private record StructuredLogEvent(
            String event,
            String action,
            int count,
            String errorCategory,
            String message
    ) {
    }
}
