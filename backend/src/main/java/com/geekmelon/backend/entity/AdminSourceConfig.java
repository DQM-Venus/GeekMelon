package com.geekmelon.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "admin_source_config")
public class AdminSourceConfig {

    @Id
    @Column(name = "source_key", nullable = false, length = 50)
    private String sourceKey;

    @Column(name = "display_name", nullable = false, length = 100)
    private String displayName;

    @Column(nullable = false)
    private Boolean enabled;

    @Column(name = "max_items", nullable = false)
    private Integer maxItems;

    @Column(name = "run_order", nullable = false)
    private Integer runOrder;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public String getSourceKey() {
        return sourceKey;
    }

    public void setSourceKey(String sourceKey) {
        this.sourceKey = sourceKey;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Integer getMaxItems() {
        return maxItems;
    }

    public void setMaxItems(Integer maxItems) {
        this.maxItems = maxItems;
    }

    public Integer getRunOrder() {
        return runOrder;
    }

    public void setRunOrder(Integer runOrder) {
        this.runOrder = runOrder;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
