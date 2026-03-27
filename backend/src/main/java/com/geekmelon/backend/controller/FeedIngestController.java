package com.geekmelon.backend.controller;

import com.geekmelon.backend.dto.ApiResponse;
import com.geekmelon.backend.dto.FeedIngestRequest;
import com.geekmelon.backend.dto.FeedIngestResult;
import com.geekmelon.backend.service.FeedIngestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/internal/feeds")
public class FeedIngestController {

    private static final String TOKEN_HEADER = "X-GeekMelon-Token";

    private final FeedIngestService feedIngestService;

    public FeedIngestController(FeedIngestService feedIngestService) {
        this.feedIngestService = feedIngestService;
    }

    @PostMapping("/ingest")
    public ResponseEntity<ApiResponse<FeedIngestResult>> ingest(
            @RequestHeader(name = TOKEN_HEADER, required = false) String token,
            @Valid @RequestBody FeedIngestRequest request
    ) {
        FeedIngestResult result = feedIngestService.ingest(token, request);
        return ResponseEntity.ok(ApiResponse.success("接收成功", result));
    }
}
