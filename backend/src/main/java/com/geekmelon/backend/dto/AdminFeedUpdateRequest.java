package com.geekmelon.backend.dto;

public class AdminFeedUpdateRequest {

    private String status;
    private String adminTitle;
    private String adminHighlight;
    private String adminSummary;
    private String adminCategory;
    private Integer adminSpicyIndex;
    private Boolean adminFeatured;
    private Integer adminFeaturedRank;
    private String adminNote;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAdminTitle() {
        return adminTitle;
    }

    public void setAdminTitle(String adminTitle) {
        this.adminTitle = adminTitle;
    }

    public String getAdminHighlight() {
        return adminHighlight;
    }

    public void setAdminHighlight(String adminHighlight) {
        this.adminHighlight = adminHighlight;
    }

    public String getAdminSummary() {
        return adminSummary;
    }

    public void setAdminSummary(String adminSummary) {
        this.adminSummary = adminSummary;
    }

    public String getAdminCategory() {
        return adminCategory;
    }

    public void setAdminCategory(String adminCategory) {
        this.adminCategory = adminCategory;
    }

    public Integer getAdminSpicyIndex() {
        return adminSpicyIndex;
    }

    public void setAdminSpicyIndex(Integer adminSpicyIndex) {
        this.adminSpicyIndex = adminSpicyIndex;
    }

    public Boolean getAdminFeatured() {
        return adminFeatured;
    }

    public void setAdminFeatured(Boolean adminFeatured) {
        this.adminFeatured = adminFeatured;
    }

    public Integer getAdminFeaturedRank() {
        return adminFeaturedRank;
    }

    public void setAdminFeaturedRank(Integer adminFeaturedRank) {
        this.adminFeaturedRank = adminFeaturedRank;
    }

    public String getAdminNote() {
        return adminNote;
    }

    public void setAdminNote(String adminNote) {
        this.adminNote = adminNote;
    }
}
