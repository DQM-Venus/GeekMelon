package com.geekmelon.backend.dto;

import java.time.LocalDateTime;

public record AdminTaskRunLogResponse(
        Long id,
        String runId,
        String sourceKey,
        String triggerType,
        String status,
        LocalDateTime startedAt,
        LocalDateTime endedAt,
        Integer createdCount,
        Integer updatedCount,
        Integer skippedCount,
        Integer filteredCount,
        String errorCategory,
        String errorDetail
) {
}
