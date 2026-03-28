package com.geekmelon.backend.dto;

public record AdminTaskPreviewItemResponse(
        String title,
        String sourceUrl,
        String rawPublishTime,
        String category,
        int spicyIndex,
        String decision,
        String highlight,
        String summary
) {
}
