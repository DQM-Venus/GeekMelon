package com.geekmelon.backend.controller;

import com.geekmelon.backend.dto.ApiResponse;
import com.geekmelon.backend.dto.FeedDetailResponse;
import com.geekmelon.backend.dto.FeedListItemResponse;
import com.geekmelon.backend.dto.PageResult;
import com.geekmelon.backend.service.FeedQueryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/feeds")
public class FeedQueryController {

    private final FeedQueryService feedQueryService;

    public FeedQueryController(FeedQueryService feedQueryService) {
        this.feedQueryService = feedQueryService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResult<FeedListItemResponse>>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(name = "page_size", defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String category,
            @RequestParam(name = "min_spicy_index", required = false) Integer minSpicyIndex,
            @RequestParam(name = "date_scope", required = false) String dateScope,
            @RequestParam(name = "fetch_all", defaultValue = "false") Boolean fetchAll,
            @RequestParam(defaultValue = "latest") String sort
    ) {
        PageResult<FeedListItemResponse> result = feedQueryService.list(
                page,
                pageSize,
                source,
                category,
                minSpicyIndex,
                dateScope,
                Boolean.TRUE.equals(fetchAll),
                sort
        );
        return ResponseEntity.ok(ApiResponse.success("查询成功", result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FeedDetailResponse>> detail(@PathVariable Long id) {
        FeedDetailResponse result = feedQueryService.detail(id);
        return ResponseEntity.ok(ApiResponse.success("查询成功", result));
    }
}
