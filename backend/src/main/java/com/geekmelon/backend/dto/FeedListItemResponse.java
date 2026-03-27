package com.geekmelon.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public record FeedListItemResponse(
        Long id,
        String source,
        String sourceUrl,
        String title,
        String authorName,
        String summary,
        String highlight,
        String category,
        List<String> tags,
        Integer spicyIndex,
        LocalDateTime rawPublishTime,
        LocalDateTime createdAt,
        String displayTitle,
        String displayHighlight,
        String displaySummary,
        Boolean adminEdited,
        Boolean editorPick,
        Boolean adminFeatured
) {
}
