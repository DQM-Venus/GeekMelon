package com.geekmelon.backend.service;

import com.geekmelon.backend.config.GeekMelonProperties;
import com.geekmelon.backend.dto.AdminAuthResponse;
import com.geekmelon.backend.exception.BizException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class AdminAuthService {

    private final GeekMelonProperties properties;

    public AdminAuthService(GeekMelonProperties properties) {
        this.properties = properties;
    }

    public AdminAuthResponse login(
            String username,
            String password,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        String expectedUsername = properties.admin() == null ? "admin" : properties.admin().username();
        String expectedPassword = properties.admin() == null ? "geekmelon-admin" : properties.admin().password();
        if (!StringUtils.hasText(expectedUsername) || !StringUtils.hasText(expectedPassword)) {
            throw new BizException(500, "后台管理员账号尚未配置");
        }
        if (!expectedUsername.equals(username) || !expectedPassword.equals(password)) {
            throw new BizException(401, "管理员账号或密码错误");
        }

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                username,
                null,
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        HttpSession session = request.getSession(true);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);
        return new AdminAuthResponse(username, "后台管理员");
    }

    public AdminAuthResponse currentAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BizException(401, "请先登录后台");
        }
        return new AdminAuthResponse(authentication.getName(), "后台管理员");
    }

    public void logout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
    }
}
