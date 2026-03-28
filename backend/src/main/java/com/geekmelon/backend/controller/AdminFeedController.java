package com.geekmelon.backend.controller;

import com.geekmelon.backend.dto.AdminFeedBatchRequest;
import com.geekmelon.backend.dto.AdminFeedBatchResponse;
import com.geekmelon.backend.dto.AdminFeedDetailResponse;
import com.geekmelon.backend.dto.AdminFeedListItemResponse;
import com.geekmelon.backend.dto.AdminFeedUpdateRequest;
import com.geekmelon.backend.dto.ApiResponse;
import com.geekmelon.backend.dto.PageResult;
import com.geekmelon.backend.service.AdminFeedService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/feeds")
public class AdminFeedController {

    private final AdminFeedService adminFeedService;

    public AdminFeedController(AdminFeedService adminFeedService) {
        this.adminFeedService = adminFeedService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResult<AdminFeedListItemResponse>>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(name = "page_size", defaultValue = "20") Integer pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(name = "editor_pick", required = false) Boolean editorPick,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(name = "duplicate_group", required = false) Long duplicateGroup
    ) {
        PageResult<AdminFeedListItemResponse> result = adminFeedService.list(
                page,
                pageSize,
                keyword,
                source,
                category,
                status,
                editorPick,
                featured,
                duplicateGroup
        );
        return ResponseEntity.ok(ApiResponse.success("查询成功", result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminFeedDetailResponse>> detail(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("查询成功", adminFeedService.detail(id)));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminFeedDetailResponse>> update(
            @PathVariable Long id,
            @RequestBody AdminFeedUpdateRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("保存成功", adminFeedService.update(id, request)));
    }

    @PostMapping("/{id}/hide")
    public ResponseEntity<ApiResponse<AdminFeedDetailResponse>> hide(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("已隐藏", adminFeedService.hide(id)));
    }

    @PostMapping("/{id}/restore")
    public ResponseEntity<ApiResponse<AdminFeedDetailResponse>> restore(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("已恢复", adminFeedService.restore(id)));
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<AdminFeedBatchResponse>> batch(@Valid @RequestBody AdminFeedBatchRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "批量操作完成",
                        adminFeedService.batchUpdate(request.ids(), request.action())
                )
        );
    }
}
