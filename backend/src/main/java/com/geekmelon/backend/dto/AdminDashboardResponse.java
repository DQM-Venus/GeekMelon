package com.geekmelon.backend.dto;

import java.util.List;

public record AdminDashboardResponse(
        long todayNewCount,
        long hiddenCount,
        long featuredCount,
        long activeSourceCount,
        boolean editorialEnabled,
        boolean deepseekConfigured,
        String editorialModel,
        String crawlerPythonCommand,
        String crawlerWorkingDirectory,
        List<AdminTaskRunLogResponse> recentRuns
) {
}
