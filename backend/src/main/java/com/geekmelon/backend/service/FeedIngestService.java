package com.geekmelon.backend.service;

import com.geekmelon.backend.config.GeekMelonProperties;
import com.geekmelon.backend.dto.FeedIngestRequest;
import com.geekmelon.backend.dto.FeedIngestResult;
import com.geekmelon.backend.entity.AiNewsFeed;
import com.geekmelon.backend.exception.BizException;
import com.geekmelon.backend.repository.AiNewsFeedRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class FeedIngestService {

    private final GeekMelonProperties properties;
    private final AiNewsFeedRepository aiNewsFeedRepository;

    public FeedIngestService(GeekMelonProperties properties, AiNewsFeedRepository aiNewsFeedRepository) {
        this.properties = properties;
        this.aiNewsFeedRepository = aiNewsFeedRepository;
    }

    @Transactional
    public FeedIngestResult ingest(String token, FeedIngestRequest request) {
        validateToken(token);

        return aiNewsFeedRepository.findBySourceAndSourcePostId(request.source(), request.sourcePostId())
                .map(existing -> updateOrSkip(existing, request))
                .orElseGet(() -> createFeed(request));
    }

    private void validateToken(String token) {
        String expectedToken = properties.ingest() == null ? null : properties.ingest().token();
        if (!StringUtils.hasText(expectedToken)) {
            throw new BizException(500, "未配置 ingest token");
        }
        if (!expectedToken.equals(token)) {
            throw new BizException(401, "Token 无效");
        }
    }

    private FeedIngestResult createFeed(FeedIngestRequest request) {
        LocalDateTime now = LocalDateTime.now();
        AiNewsFeed entity = new AiNewsFeed();
        fillEntity(entity, request);
        entity.setIngestTokenName("default");
        entity.setStatus("active");
        entity.setFirstSeenAt(now);
        entity.setLastSeenAt(now);
        entity.setCreatedAt(now);
        entity.setUpdatedAt(now);
        entity.setDuplicateOfId(resolveDuplicateOfId(entity));

        AiNewsFeed saved = aiNewsFeedRepository.save(entity);
        return new FeedIngestResult(saved.getId(), "created");
    }

    private FeedIngestResult updateOrSkip(AiNewsFeed existing, FeedIngestRequest request) {
        LocalDateTime now = LocalDateTime.now();
        existing.setLastSeenAt(now);

        String incomingContentHash = resolveContentHash(request);
        String currentContentHash = existing.getContentHash();
        if (StringUtils.hasText(currentContentHash) && currentContentHash.equals(incomingContentHash)) {
            aiNewsFeedRepository.save(existing);
            return new FeedIngestResult(existing.getId(), "skipped");
        }

        fillEntity(existing, request);
        existing.setUpdatedAt(now);
        existing.setLastSeenAt(now);
        existing.setDuplicateOfId(resolveDuplicateOfId(existing));
        AiNewsFeed saved = aiNewsFeedRepository.save(existing);
        return new FeedIngestResult(saved.getId(), "updated");
    }

    private void fillEntity(AiNewsFeed entity, FeedIngestRequest request) {
        entity.setSource(request.source());
        entity.setSourcePostId(request.sourcePostId());
        entity.setSourceUrl(request.sourceUrl());
        entity.setNormalizedUrl(resolveNormalizedUrl(request));
        entity.setTitle(request.title());
        entity.setAuthorName(request.authorName());
        entity.setRawContent(request.rawContent());
        entity.setContentHash(resolveContentHash(request));
        entity.setEventFingerprint(resolveEventFingerprint(request));
        entity.setRawPublishTime(request.rawPublishTime() == null ? null : request.rawPublishTime().toLocalDateTime());
        entity.setSummary(request.summary());
        entity.setHighlight(request.highlight());
        entity.setCategory(request.category());
        entity.setTags(joinTags(request.tags()));
        entity.setSpicyIndex(request.spicyIndex());
        entity.setVerdict(request.verdict());
        entity.setDropReason(request.dropReason());
        entity.setAiModel(request.aiModel());
        entity.setAiPromptVersion(request.aiPromptVersion());
    }

    private String resolveNormalizedUrl(FeedIngestRequest request) {
        if (StringUtils.hasText(request.normalizedUrl())) {
            return request.normalizedUrl().trim();
        }

        try {
            URI uri = new URI(request.sourceUrl().trim());
            String scheme = uri.getScheme() == null ? "https" : uri.getScheme().toLowerCase();
            String host = uri.getHost() == null ? "" : uri.getHost().toLowerCase();
            String path = StringUtils.hasText(uri.getPath()) ? uri.getPath() : "/";
            if (path.length() > 1 && path.endsWith("/")) {
                path = path.substring(0, path.length() - 1);
            }
            String query = StringUtils.hasText(uri.getQuery()) ? "?" + uri.getQuery() : "";
            return scheme + "://" + host + path + query;
        } catch (URISyntaxException exception) {
            return request.sourceUrl().trim();
        }
    }

    private String resolveContentHash(FeedIngestRequest request) {
        if (StringUtils.hasText(request.contentHash())) {
            return request.contentHash().trim();
        }
        return Integer.toHexString(Objects.hash(request.title(), request.rawContent()));
    }

    private String resolveEventFingerprint(FeedIngestRequest request) {
        if (StringUtils.hasText(request.eventFingerprint())) {
            return request.eventFingerprint().trim();
        }

        String title = request.title() == null ? "" : request.title().trim().toLowerCase();
        String normalizedTitle = title
                .replaceAll("\\bopenai\\b", " ")
                .replaceAll("\\bmarktechpost\\b", " ")
                .replaceAll("\\barxiv\\b", " ")
                .replaceAll("[^a-z0-9\\u4e00-\\u9fff]+", " ")
                .replaceAll("\\s+", " ")
                .trim();
        String datePart = request.rawPublishTime() == null ? "" : request.rawPublishTime().toLocalDate().toString();
        return sha256(normalizedTitle + "|" + datePart);
    }

    private Long resolveDuplicateOfId(AiNewsFeed entity) {
        if (!StringUtils.hasText(entity.getEventFingerprint())) {
            return null;
        }

        return aiNewsFeedRepository
                .findFirstByEventFingerprintAndDuplicateOfIdIsNullAndStatusOrderByCreatedAtAsc(entity.getEventFingerprint(), "active")
                .filter(candidate -> !candidate.getId().equals(entity.getId()))
                .map(AiNewsFeed::getId)
                .orElse(null);
    }

    private String sha256(String payload) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] bytes = digest.digest(payload.getBytes(StandardCharsets.UTF_8));
            StringBuilder builder = new StringBuilder();
            for (byte value : bytes) {
                builder.append(String.format("%02x", value));
            }
            return builder.toString();
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 不可用", exception);
        }
    }

    private String joinTags(List<String> tags) {
        if (tags == null || tags.isEmpty()) {
            return null;
        }
        return tags.stream()
                .filter(StringUtils::hasText)
                .map(String::trim)
                .reduce((left, right) -> left + "," + right)
                .orElse(null);
    }
}
