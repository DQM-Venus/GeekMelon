package com.geekmelon.backend.controller;

import com.geekmelon.backend.dto.AdminSourceConfigResponse;
import com.geekmelon.backend.dto.AdminSourceUpdateRequest;
import com.geekmelon.backend.dto.AdminTaskRunLogResponse;
import com.geekmelon.backend.dto.AdminTaskTriggerRequest;
import com.geekmelon.backend.dto.ApiResponse;
import com.geekmelon.backend.service.AdminSourceService;
import com.geekmelon.backend.service.AdminTaskService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminSourceController {

    private final AdminSourceService adminSourceService;
    private final AdminTaskService adminTaskService;

    public AdminSourceController(AdminSourceService adminSourceService, AdminTaskService adminTaskService) {
        this.adminSourceService = adminSourceService;
        this.adminTaskService = adminTaskService;
    }

    @GetMapping("/sources")
    public ResponseEntity<ApiResponse<List<AdminSourceConfigResponse>>> listSources() {
        return ResponseEntity.ok(ApiResponse.success("查询成功", adminSourceService.listSources()));
    }

    @PatchMapping("/sources/{sourceKey}")
    public ResponseEntity<ApiResponse<AdminSourceConfigResponse>> updateSource(
            @PathVariable String sourceKey,
            @RequestBody AdminSourceUpdateRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("保存成功", adminSourceService.updateSource(sourceKey, request)));
    }

    @PostMapping("/tasks/collect")
    public ResponseEntity<ApiResponse<AdminTaskRunLogResponse>> collect(@Valid @RequestBody AdminTaskTriggerRequest request) {
        return ResponseEntity.ok(ApiResponse.success("任务执行完成", adminTaskService.triggerManualCollect(request.sourceKey())));
    }

    @GetMapping("/tasks/runs")
    public ResponseEntity<ApiResponse<List<AdminTaskRunLogResponse>>> listRuns() {
        return ResponseEntity.ok(ApiResponse.success("查询成功", adminTaskService.listRuns()));
    }
}
