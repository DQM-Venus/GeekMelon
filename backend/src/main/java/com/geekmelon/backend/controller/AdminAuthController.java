package com.geekmelon.backend.controller;

import com.geekmelon.backend.dto.AdminAuthResponse;
import com.geekmelon.backend.dto.AdminLoginRequest;
import com.geekmelon.backend.dto.ApiResponse;
import com.geekmelon.backend.service.AdminAuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/auth")
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    public AdminAuthController(AdminAuthService adminAuthService) {
        this.adminAuthService = adminAuthService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AdminAuthResponse>> login(
            @Valid @RequestBody AdminLoginRequest request,
            HttpServletRequest httpServletRequest,
            HttpServletResponse httpServletResponse
    ) {
        AdminAuthResponse response = adminAuthService.login(
                request.username(),
                request.password(),
                httpServletRequest,
                httpServletResponse
        );
        return ResponseEntity.ok(ApiResponse.success("登录成功", response));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            HttpServletRequest httpServletRequest,
            HttpServletResponse httpServletResponse
    ) {
        adminAuthService.logout(httpServletRequest, httpServletResponse);
        return ResponseEntity.ok(ApiResponse.success("退出成功", null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AdminAuthResponse>> me() {
        return ResponseEntity.ok(ApiResponse.success("查询成功", adminAuthService.currentAdmin()));
    }
}
