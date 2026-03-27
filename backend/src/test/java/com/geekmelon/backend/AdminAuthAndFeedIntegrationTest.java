package com.geekmelon.backend;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AdminAuthAndFeedIntegrationTest extends BackendIntegrationTestSupport {

    @Test
    void shouldRejectAdminApiWithoutLogin() throws Exception {
        mockMvc.perform(get("/api/admin/feeds"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldInvalidateSessionAfterLogout() throws Exception {
        MockHttpSession session = loginAsAdmin();

        mockMvc.perform(post("/api/admin/auth/logout").session(session))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/admin/feeds").session(session))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldHideRestoreAndExposeAdminOverridesToPublicFeeds() throws Exception {
        var entity = saveFeed("cls", "admin-edit-1", "original title", yesterdayAt(11, 0), yesterdayAt(11, 0));
        MockHttpSession session = loginAsAdmin();

        mockMvc.perform(post("/api/admin/feeds/{id}/hide", entity.getId()).session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("hidden"));

        mockMvc.perform(get("/api/feeds")
                        .param("page", "1")
                        .param("page_size", "10")
                        .param("date_scope", "yesterday"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.total").value(0));

        String payload = """
                {
                  "status": "active",
                  "adminTitle": "edited title",
                  "adminSummary": "edited summary",
                  "adminSpicyIndex": 9
                }
                """;

        mockMvc.perform(patch("/api/admin/feeds/{id}", entity.getId())
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("active"))
                .andExpect(jsonPath("$.data.adminTitle").value("edited title"));

        mockMvc.perform(get("/api/feeds")
                        .param("page", "1")
                        .param("page_size", "10")
                        .param("date_scope", "yesterday"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.total").value(1))
                .andExpect(jsonPath("$.data.records[0].displayTitle").value("edited title"))
                .andExpect(jsonPath("$.data.records[0].displaySummary").value("edited summary"))
                .andExpect(jsonPath("$.data.records[0].spicyIndex").value(9));
    }
}
