package com.geekmelon.backend;

import org.junit.jupiter.api.Test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class FeedQueryYesterdayIntegrationTest extends BackendIntegrationTestSupport {

    @Test
    void shouldReturnOnlyYesterdayRecords() throws Exception {
        saveFeed("cls", "yesterday-1", "yesterday item 1", yesterdayAt(9, 0), yesterdayAt(9, 0));
        saveFeed("kr36", "yesterday-2", "yesterday item 2", yesterdayAt(18, 30), yesterdayAt(18, 30));
        saveFeed("qbitai", "today-1", "today item", todayAt(8, 0), todayAt(8, 0));

        mockMvc.perform(get("/api/feeds")
                        .param("page", "1")
                        .param("page_size", "10")
                        .param("date_scope", "yesterday"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.total").value(2))
                .andExpect(jsonPath("$.data.records.length()").value(2));
    }

    @Test
    void shouldFallbackToCreatedAtWhenRawPublishTimeMissing() throws Exception {
        saveFeed("cls", "fallback-yesterday", "fallback yesterday", null, yesterdayAt(10, 15));
        saveFeed("cls", "fallback-today", "fallback today", null, todayAt(9, 0));

        mockMvc.perform(get("/api/feeds")
                        .param("page", "1")
                        .param("page_size", "10")
                        .param("date_scope", "yesterday"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.total").value(1))
                .andExpect(jsonPath("$.data.records[0].title").value("fallback yesterday"));
    }

    @Test
    void shouldReturnWholeYesterdayDatasetWhenFetchAllEnabled() throws Exception {
        saveFeed("cls", "all-1", "all item A", yesterdayAt(8, 0), yesterdayAt(8, 0));
        saveFeed("kr36", "all-2", "all item B", yesterdayAt(9, 0), yesterdayAt(9, 0));
        saveFeed("juejin", "all-3", "all item C", yesterdayAt(10, 0), yesterdayAt(10, 0));

        mockMvc.perform(get("/api/feeds")
                        .param("page", "1")
                        .param("page_size", "2")
                        .param("date_scope", "yesterday")
                        .param("fetch_all", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.total").value(3))
                .andExpect(jsonPath("$.data.page").value(1))
                .andExpect(jsonPath("$.data.totalPages").value(1))
                .andExpect(jsonPath("$.data.records.length()").value(3));
    }
}
