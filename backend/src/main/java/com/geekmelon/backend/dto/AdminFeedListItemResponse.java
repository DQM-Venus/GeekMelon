package com.geekmelon.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public record AdminFeedListItemResponse(
        Long id,
        String source,
        String sourceUrl,
        String title,
        String adminTitle,
        String authorName,
        String category,
        String adminCategory,
        Integer spicyIndex,
        Integer adminSpicyIndex,
        String status,
        Long duplicateOfId,
        Boolean editorPick,
        Boolean adminFeatured,
        Integer adminFeaturedRank,
        LocalDateTime rawPublishTime,
        LocalDateTime firstSeenAt,
        LocalDateTime lastSeenAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        LocalDateTime adminUpdatedAt,
        List<String> tags
) {
}
