package com.geekmelon.backend.service;

import com.geekmelon.backend.dto.AdminSourceConfigResponse;
import com.geekmelon.backend.dto.AdminSourceUpdateRequest;
import com.geekmelon.backend.entity.AdminSourceConfig;
import com.geekmelon.backend.exception.BizException;
import com.geekmelon.backend.repository.AdminSourceConfigRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminSourceService {

    private final AdminSourceConfigRepository adminSourceConfigRepository;

    public AdminSourceService(AdminSourceConfigRepository adminSourceConfigRepository) {
        this.adminSourceConfigRepository = adminSourceConfigRepository;
    }

    @Transactional
    public List<AdminSourceConfigResponse> listSources() {
        ensureDefaults();
        return adminSourceConfigRepository.findAllByOrderByRunOrderAscDisplayNameAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public AdminSourceConfigResponse updateSource(String sourceKey, AdminSourceUpdateRequest request) {
        ensureDefaults();
        AdminSourceConfig entity = adminSourceConfigRepository.findById(sourceKey)
                .orElseThrow(() -> new BizException(404, "来源不存在"));

        if (request.getEnabled() != null) {
            entity.setEnabled(request.getEnabled());
        }
        if (request.getMaxItems() != null) {
            int maxItems = Math.max(1, Math.min(request.getMaxItems(), 50));
            entity.setMaxItems(maxItems);
        }
        if (request.getRunOrder() != null) {
            entity.setRunOrder(Math.max(1, request.getRunOrder()));
        }

        entity.setUpdatedAt(LocalDateTime.now());
        return toResponse(adminSourceConfigRepository.save(entity));
    }

    @Transactional
    public AdminSourceConfig getRequiredSource(String sourceKey) {
        ensureDefaults();
        return adminSourceConfigRepository.findById(sourceKey)
                .orElseThrow(() -> new BizException(404, "来源不存在"));
    }

    @Transactional
    public long countEnabledSources() {
        ensureDefaults();
        return adminSourceConfigRepository.findAll().stream()
                .filter(AdminSourceConfig::getEnabled)
                .count();
    }

    @Transactional
    public void ensureDefaults() {
        List<AdminSourceCatalog.ManagedSourceDefinition> definitions = AdminSourceCatalog.definitions();
        for (AdminSourceCatalog.ManagedSourceDefinition definition : definitions) {
            adminSourceConfigRepository.findById(definition.sourceKey())
                    .or(() -> java.util.Optional.of(saveDefault(definition)));
        }
    }

    private AdminSourceConfig saveDefault(AdminSourceCatalog.ManagedSourceDefinition definition) {
        AdminSourceConfig entity = new AdminSourceConfig();
        entity.setSourceKey(definition.sourceKey());
        entity.setDisplayName(definition.displayName());
        entity.setEnabled(!"jiqizhixin".equals(definition.sourceKey()));
        entity.setMaxItems(definition.defaultMaxItems());
        entity.setRunOrder(definition.defaultRunOrder());
        entity.setUpdatedAt(LocalDateTime.now());
        return adminSourceConfigRepository.save(entity);
    }

    private AdminSourceConfigResponse toResponse(AdminSourceConfig entity) {
        return new AdminSourceConfigResponse(
                entity.getSourceKey(),
                entity.getDisplayName(),
                Boolean.TRUE.equals(entity.getEnabled()),
                entity.getMaxItems(),
                entity.getRunOrder(),
                entity.getUpdatedAt()
        );
    }
}
