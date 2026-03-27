package com.geekmelon.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.geekmelon.backend.entity.AiNewsFeed;
import com.geekmelon.backend.repository.AiNewsFeedRepository;
import com.geekmelon.backend.repository.AdminSourceConfigRepository;
import com.geekmelon.backend.repository.AdminTaskRunLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public abstract class BackendIntegrationTestSupport {

    protected static final ZoneId SHANGHAI_ZONE = ZoneId.of("Asia/Shanghai");

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;

    @Autowired
    protected AiNewsFeedRepository aiNewsFeedRepository;

    @Autowired
    protected AdminSourceConfigRepository adminSourceConfigRepository;

    @Autowired
    protected AdminTaskRunLogRepository adminTaskRunLogRepository;

    @BeforeEach
    void cleanDatabase() {
        adminTaskRunLogRepository.deleteAll();
        adminSourceConfigRepository.deleteAll();
        aiNewsFeedRepository.deleteAll();
    }

    protected MockHttpSession loginAsAdmin() throws Exception {
        String body = """
                {
                  "username": "admin",
                  "password": "geekmelon-admin"
                }
                """;

        return (MockHttpSession) mockMvc.perform(post("/api/admin/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andReturn()
                .getRequest()
                .getSession(false);
    }

    protected AiNewsFeed saveFeed(
            String source,
            String sourcePostId,
            String title,
            LocalDateTime rawPublishTime,
            LocalDateTime createdAt
    ) {
        AiNewsFeed entity = new AiNewsFeed();
        entity.setSource(source);
        entity.setSourcePostId(sourcePostId);
        entity.setSourceUrl("https://example.com/" + sourcePostId);
        entity.setNormalizedUrl(entity.getSourceUrl());
        entity.setTitle(title);
        entity.setAuthorName("tester");
        entity.setRawContent(title + " content");
        entity.setContentHash("hash-" + sourcePostId);
        entity.setEventFingerprint("event-" + sourcePostId);
        entity.setRawPublishTime(rawPublishTime);
        entity.setSummary(title + " summary");
        entity.setHighlight(title + " highlight");
        entity.setCategory("行业风向");
        entity.setTags("test");
        entity.setSpicyIndex(6);
        entity.setVerdict("keep");
        entity.setStatus("active");
        entity.setFirstSeenAt(createdAt);
        entity.setLastSeenAt(createdAt);
        entity.setCreatedAt(createdAt);
        entity.setUpdatedAt(createdAt);
        entity.setAdminFeatured(false);
        return aiNewsFeedRepository.save(entity);
    }

    protected LocalDateTime yesterdayAt(int hour, int minute) {
        return LocalDate.now(SHANGHAI_ZONE).minusDays(1).atTime(hour, minute);
    }

    protected LocalDateTime todayAt(int hour, int minute) {
        return LocalDate.now(SHANGHAI_ZONE).atTime(hour, minute);
    }
}
