package com.geekmelon.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public record AdminFeedDetailResponse(
        Long id,
        String source,
        String sourcePostId,
        String sourceUrl,
        String title,
        String adminTitle,
        String authorName,
        String rawContent,
        LocalDateTime rawPublishTime,
        String summary,
        String adminSummary,
        String highlight,
        String adminHighlight,
        String category,
        String adminCategory,
        List<String> tags,
        Integer spicyIndex,
        Integer adminSpicyIndex,
        String verdict,
        String dropReason,
        String aiModel,
        String aiPromptVersion,
        String status,
        Long duplicateOfId,
        Boolean editorPick,
        Boolean adminFeatured,
        Integer adminFeaturedRank,
        String adminNote,
        LocalDateTime firstSeenAt,
        LocalDateTime lastSeenAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        LocalDateTime adminUpdatedAt,
        List<RelatedSourceItemResponse> relatedSources
) {
}
