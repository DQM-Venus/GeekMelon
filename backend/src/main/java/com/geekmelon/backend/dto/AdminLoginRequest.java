package com.geekmelon.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record AdminLoginRequest(
        @NotBlank(message = "请输入管理员账号") String username,
        @NotBlank(message = "请输入管理员密码") String password
) {
}
