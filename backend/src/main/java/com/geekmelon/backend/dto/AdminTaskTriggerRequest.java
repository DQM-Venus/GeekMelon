package com.geekmelon.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record AdminTaskTriggerRequest(@NotBlank(message = "请选择要抓取的来源") String sourceKey) {
}
