package com.geekmelon.backend;

import com.geekmelon.backend.entity.AiNewsFeed;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class FeedHomepageFeaturedIntegrationTest extends BackendIntegrationTestSupport {

    @Test
    void shouldPlaceYesterdayFeaturedFeedAtTop() throws Exception {
        AiNewsFeed featuredYesterday = saveFeed("cls", "featured-yesterday", "featured yesterday", yesterdayAt(8, 0), yesterdayAt(8, 0));
        featuredYesterday.setAdminFeatured(true);
        featuredYesterday.setAdminFeaturedRank(1);
        featuredYesterday.setAdminUpdatedAt(yesterdayAt(8, 30));
        aiNewsFeedRepository.save(featuredYesterday);

        saveFeed("kr36", "normal-1", "normal item 1", yesterdayAt(9, 0), yesterdayAt(9, 0));
        saveFeed("qbitai", "normal-2", "normal item 2", yesterdayAt(10, 0), yesterdayAt(10, 0));

        mockMvc.perform(get("/api/feeds")
                        .param("page", "1")
                        .param("page_size", "10")
                        .param("date_scope", "yesterday"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.records[0].title").value("featured yesterday"))
                .andExpect(jsonPath("$.data.records[0].adminFeatured").value(true));
    }

    @Test
    void shouldNotInjectOldFeaturedFeedIntoYesterdayHomepage() throws Exception {
        AiNewsFeed oldFeatured = saveFeed(
                "cls",
                "featured-old",
                "featured old",
                LocalDate.now(SHANGHAI_ZONE).minusDays(2).atTime(12, 0),
                LocalDate.now(SHANGHAI_ZONE).minusDays(2).atTime(12, 0)
        );
        oldFeatured.setAdminFeatured(true);
        oldFeatured.setAdminFeaturedRank(1);
        oldFeatured.setAdminUpdatedAt(LocalDate.now(SHANGHAI_ZONE).minusDays(2).atTime(12, 30));
        aiNewsFeedRepository.save(oldFeatured);

        saveFeed("kr36", "normal-yesterday", "normal yesterday", yesterdayAt(9, 0), yesterdayAt(9, 0));

        mockMvc.perform(get("/api/feeds")
                        .param("page", "1")
                        .param("page_size", "10")
                        .param("date_scope", "yesterday"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.total").value(1))
                .andExpect(jsonPath("$.data.records[0].title").value("normal yesterday"));
    }
}
