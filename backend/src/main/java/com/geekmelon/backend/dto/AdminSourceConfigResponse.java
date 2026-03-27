package com.geekmelon.backend.dto;

import java.time.LocalDateTime;

public record AdminSourceConfigResponse(
        String sourceKey,
        String displayName,
        boolean enabled,
        int maxItems,
        int runOrder,
        LocalDateTime updatedAt
) {
}
