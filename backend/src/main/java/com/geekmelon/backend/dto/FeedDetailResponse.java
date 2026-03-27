package com.geekmelon.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public record FeedDetailResponse(
        Long id,
        String source,
        String sourcePostId,
        String sourceUrl,
        String title,
        String authorName,
        String rawContent,
        LocalDateTime rawPublishTime,
        String summary,
        String highlight,
        String category,
        List<String> tags,
        Integer spicyIndex,
        String verdict,
        String dropReason,
        String aiModel,
        String aiPromptVersion,
        String status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<RelatedSourceItemResponse> relatedSources
) {
}
