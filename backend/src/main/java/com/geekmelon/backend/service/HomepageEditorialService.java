package com.geekmelon.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.geekmelon.backend.config.GeekMelonProperties;
import com.geekmelon.backend.dto.FeedListItemResponse;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class HomepageEditorialService {

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    private final GeekMelonProperties properties;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final Map<String, CachedEditorialDecision> cache = new ConcurrentHashMap<>();

    public HomepageEditorialService(GeekMelonProperties properties, ObjectMapper objectMapper) {
        this.properties = properties;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder().build();
    }

    public List<FeedListItemResponse> apply(List<FeedListItemResponse> items, String sort) {
        if (items.isEmpty()) {
            return items;
        }

        GeekMelonProperties.Editorial editorial = properties.editorial();
        if (editorial == null || !editorial.enabled() || !StringUtils.hasText(editorial.apiKey())) {
            return items;
        }

        int candidateCount = Math.min(items.size(), Math.max(editorial.candidateCount(), editorial.pickCount()));
        if (candidateCount <= 1) {
            return items;
        }

        List<FeedListItemResponse> candidates = new ArrayList<>(items.subList(0, candidateCount));
        EditorialDecision decision = loadDecision(candidates, sort, editorial);
        if (decision == null || decision.pickedIds().isEmpty()) {
            return items;
        }

        return mergeDecision(items, candidates, decision, editorial.pickCount());
    }

    private EditorialDecision loadDecision(
            List<FeedListItemResponse> candidates,
            String sort,
            GeekMelonProperties.Editorial editorial
    ) {
        String cacheKey = buildCacheKey(candidates, sort, editorial.model());
        CachedEditorialDecision cachedDecision = cache.get(cacheKey);
        if (cachedDecision != null && cachedDecision.expireAt().isAfter(Instant.now())) {
            return cachedDecision.decision();
        }

        EditorialDecision fetchedDecision = requestDecision(candidates, sort, editorial);
        if (fetchedDecision != null) {
            cache.put(
                    cacheKey,
                    new CachedEditorialDecision(
                            fetchedDecision,
                            Instant.now().plusSeconds(Math.max(editorial.cacheTtlSeconds(), 60))
                    )
            );
        }
        return fetchedDecision;
    }

    private EditorialDecision requestDecision(
            List<FeedListItemResponse> candidates,
            String sort,
            GeekMelonProperties.Editorial editorial
    ) {
        try {
            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("model", editorial.model());
            payload.put("response_format", Map.of("type", "json_object"));
            payload.put(
                    "messages",
                    List.of(
                            Map.of("role", "system", "content", buildSystemPrompt(editorial.pickCount())),
                            Map.of("role", "user", "content", buildUserPrompt(candidates, sort, editorial.pickCount()))
                    )
            );
            payload.put("stream", false);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(editorial.baseUrl() + "/chat/completions"))
                    .timeout(Duration.ofSeconds(Math.max(editorial.requestTimeoutSeconds(), 5)))
                    .header("Authorization", "Bearer " + editorial.apiKey())
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(payload)))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                return null;
            }

            JsonNode responseNode = objectMapper.readTree(response.body());
            String content = responseNode.path("choices").path(0).path("message").path("content").asText("");
            if (!StringUtils.hasText(content)) {
                return null;
            }

            return parseDecision(content);
        } catch (IOException | InterruptedException exception) {
            if (exception instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            return null;
        }
    }

    private EditorialDecision parseDecision(String content) throws IOException {
        JsonNode node = objectMapper.readTree(content);

        List<Long> pickedIds = new ArrayList<>();
        for (JsonNode idNode : node.path("picked_ids")) {
            if (idNode.canConvertToLong()) {
                pickedIds.add(idNode.asLong());
            }
        }

        Map<Long, EditorialOverlay> overlays = new HashMap<>();
        for (JsonNode itemNode : node.path("items")) {
            if (!itemNode.path("id").canConvertToLong()) {
                continue;
            }
            long id = itemNode.path("id").asLong();
            overlays.put(
                    id,
                    new EditorialOverlay(
                            trimToNull(itemNode.path("display_title").asText(null)),
                            trimToNull(itemNode.path("display_highlight").asText(null)),
                            trimToNull(itemNode.path("display_summary").asText(null))
                    )
            );
        }

        return new EditorialDecision(pickedIds, overlays);
    }

    private List<FeedListItemResponse> mergeDecision(
            List<FeedListItemResponse> items,
            List<FeedListItemResponse> candidates,
            EditorialDecision decision,
            int pickCount
    ) {
        Map<Long, FeedListItemResponse> candidateById = new LinkedHashMap<>();
        for (FeedListItemResponse candidate : candidates) {
            candidateById.put(candidate.id(), candidate);
        }

        List<FeedListItemResponse> leading = new ArrayList<>();
        Set<Long> usedIds = new HashSet<>();

        for (Long pickedId : decision.pickedIds()) {
            if (leading.size() >= pickCount) {
                break;
            }
            FeedListItemResponse candidate = candidateById.get(pickedId);
            if (candidate == null || !usedIds.add(pickedId)) {
                continue;
            }
            leading.add(applyOverlay(candidate, decision.overlays().get(pickedId), true));
        }

        for (FeedListItemResponse candidate : candidates) {
            if (usedIds.contains(candidate.id())) {
                continue;
            }
            leading.add(applyOverlay(candidate, null, false));
        }

        List<FeedListItemResponse> merged = new ArrayList<>(leading);
        for (int index = candidates.size(); index < items.size(); index++) {
            merged.add(applyOverlay(items.get(index), null, false));
        }
        return merged;
    }

    private FeedListItemResponse applyOverlay(
            FeedListItemResponse item,
            EditorialOverlay overlay,
            boolean editorPick
    ) {
        boolean preferExistingDisplay = Boolean.TRUE.equals(item.adminEdited());

        String displayTitle = !preferExistingDisplay && overlay != null && StringUtils.hasText(overlay.displayTitle())
                ? overlay.displayTitle()
                : item.displayTitle();
        String displayHighlight = !preferExistingDisplay && overlay != null && StringUtils.hasText(overlay.displayHighlight())
                ? overlay.displayHighlight()
                : item.displayHighlight();
        String displaySummary = !preferExistingDisplay && overlay != null && StringUtils.hasText(overlay.displaySummary())
                ? overlay.displaySummary()
                : item.displaySummary();

        return new FeedListItemResponse(
                item.id(),
                item.source(),
                item.sourceUrl(),
                item.title(),
                item.authorName(),
                item.summary(),
                item.highlight(),
                item.category(),
                item.tags(),
                item.spicyIndex(),
                item.rawPublishTime(),
                item.createdAt(),
                displayTitle,
                displayHighlight,
                displaySummary,
                item.adminEdited(),
                editorPick,
                item.adminFeatured()
        );
    }

    private String buildCacheKey(List<FeedListItemResponse> candidates, String sort, String model) {
        List<Map<String, Object>> payload = candidates.stream()
                .map(candidate -> Map.<String, Object>of(
                        "id", candidate.id(),
                        "source", candidate.source(),
                        "title", candidate.title(),
                        "highlight", Objects.toString(candidate.highlight(), ""),
                        "summary", Objects.toString(candidate.summary(), ""),
                        "spicyIndex", candidate.spicyIndex() == null ? 0 : candidate.spicyIndex(),
                        "createdAt", candidate.createdAt() == null ? "" : DATE_TIME_FORMATTER.format(candidate.createdAt())
                ))
                .toList();

        try {
            return objectMapper.writeValueAsString(Map.of("sort", sort, "model", model, "candidates", payload));
        } catch (IOException exception) {
            return sort + ":" + model + ":" + candidates.size();
        }
    }

    private String buildSystemPrompt(int pickCount) {
        return """
                你是 Geek Melon 首页主编。
                你的任务是从候选 AI 资讯中选出最值得放在首页前列的内容，并优化展示文案。
                你需要兼顾三件事：
                1. 优先保留有明确事件性的内容，如公司动作、产品发布、平台接入、融资并购、争议舆情、关键人物表态。
                2. 保持来源多样性，不要让单一来源刷屏。
                3. 避免公文腔、评论社论腔、纯宏观空话和无信息增量内容占据首页。

                只返回 JSON，不要输出其他说明。
                JSON 字段格式：
                {
                  "picked_ids": [long],
                  "items": [
                    {
                      "id": long,
                      "display_title": "不超过40字",
                      "display_highlight": "不超过60字的一句话爆点",
                      "display_summary": "两到三句摘要"
                    }
                  ]
                }

                规则：
                - picked_ids 最多返回 %d 条。
                - picked_ids 里的顺序就是首页推荐顺序。
                - 只有真正值得首页前排的内容才进入 picked_ids。
                - 若某条不值得精选，不要放进 picked_ids。
                - display_title / display_highlight / display_summary 必须忠于原始事实，不能编造。
                """.formatted(pickCount);
    }

    private String buildUserPrompt(List<FeedListItemResponse> candidates, String sort, int pickCount) throws IOException {
        List<Map<String, Object>> candidatePayload = candidates.stream()
                .map(candidate -> {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("id", candidate.id());
                    item.put("source", candidate.source());
                    item.put("title", candidate.title());
                    item.put("highlight", candidate.highlight());
                    item.put("summary", candidate.summary());
                    item.put("category", candidate.category());
                    item.put("tags", candidate.tags());
                    item.put("spicy_index", candidate.spicyIndex());
                    item.put("raw_publish_time", candidate.rawPublishTime());
                    return item;
                })
                .toList();

        return """
                当前首页排序模式：%s
                你需要从下面的候选池里挑选最多 %d 条首页精选，并重写首页展示文案。

                候选池：
                %s
                """.formatted(sort, pickCount, objectMapper.writeValueAsString(candidatePayload));
    }

    private String trimToNull(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        return value.trim();
    }

    private record EditorialDecision(List<Long> pickedIds, Map<Long, EditorialOverlay> overlays) {
    }

    private record EditorialOverlay(String displayTitle, String displayHighlight, String displaySummary) {
    }

    private record CachedEditorialDecision(EditorialDecision decision, Instant expireAt) {
    }
}
