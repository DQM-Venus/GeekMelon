package com.geekmelon.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record AdminFeedBatchRequest(
        @NotEmpty(message = "请至少选择一条内容")
        List<Long> ids,
        @NotBlank(message = "批量动作不能为空")
        String action
) {
}
