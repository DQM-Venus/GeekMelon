package com.geekmelon.backend.dto;

import java.util.List;

public record AdminFeedBatchResponse(
        String action,
        int requestedCount,
        int successCount,
        int ignoredCount,
        List<Long> affectedIds
) {
}
