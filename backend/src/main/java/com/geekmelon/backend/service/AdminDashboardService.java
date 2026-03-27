package com.geekmelon.backend.service;

import com.geekmelon.backend.config.GeekMelonProperties;
import com.geekmelon.backend.dto.AdminDashboardResponse;
import com.geekmelon.backend.repository.AiNewsFeedRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class AdminDashboardService {

    private final GeekMelonProperties properties;
    private final AiNewsFeedRepository aiNewsFeedRepository;
    private final AdminSourceService adminSourceService;
    private final AdminTaskService adminTaskService;

    public AdminDashboardService(
            GeekMelonProperties properties,
            AiNewsFeedRepository aiNewsFeedRepository,
            AdminSourceService adminSourceService,
            AdminTaskService adminTaskService
    ) {
        this.properties = properties;
        this.aiNewsFeedRepository = aiNewsFeedRepository;
        this.adminSourceService = adminSourceService;
        this.adminTaskService = adminTaskService;
    }

    public AdminDashboardResponse getDashboard() {
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        boolean editorialEnabled = properties.editorial() != null && properties.editorial().enabled();
        boolean deepseekConfigured = properties.editorial() != null
                && properties.editorial().apiKey() != null
                && !properties.editorial().apiKey().isBlank();

        return new AdminDashboardResponse(
                aiNewsFeedRepository.countByCreatedAtAfter(todayStart),
                aiNewsFeedRepository.countByStatus("hidden"),
                aiNewsFeedRepository.countByAdminFeaturedTrueAndStatus("active"),
                adminSourceService.countEnabledSources(),
                editorialEnabled,
                deepseekConfigured,
                properties.editorial() == null ? "deepseek-chat" : properties.editorial().model(),
                properties.crawler() == null ? "python" : properties.crawler().pythonCommand(),
                properties.crawler() == null ? "../crawler" : properties.crawler().workingDirectory(),
                adminTaskService.listRecentRuns(8)
        );
    }
}
