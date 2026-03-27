package com.geekmelon.backend.dto;

public class AdminSourceUpdateRequest {

    private Boolean enabled;
    private Integer maxItems;
    private Integer runOrder;

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
}
