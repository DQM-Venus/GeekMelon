package com.geekmelon.backend.dto;

import java.util.List;

public record AdminTaskPreviewResponse(
        String sourceKey,
        String runId,
        int previewCount,
        int filteredCount,
        List<AdminTaskPreviewItemResponse> items
) {
}
