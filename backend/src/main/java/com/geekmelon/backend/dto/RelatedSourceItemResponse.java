package com.geekmelon.backend.dto;

import java.time.LocalDateTime;

public record RelatedSourceItemResponse(
        Long id,
        String source,
        String sourceUrl,
        String title,
        String authorName,
        Integer spicyIndex,
        LocalDateTime rawPublishTime,
        LocalDateTime createdAt,
        boolean primarySource
) {
}
