package com.geekmelon.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_news_feed")
public class AiNewsFeed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String source;

    @Column(name = "source_post_id", nullable = false, length = 128)
    private String sourcePostId;

    @Column(name = "source_url", nullable = false, length = 500)
    private String sourceUrl;

    @Column(name = "normalized_url", length = 500)
    private String normalizedUrl;

    @Column(nullable = false, length = 300)
    private String title;

    @Column(name = "admin_title", length = 300)
    private String adminTitle;

    @Column(name = "author_name", length = 100)
    private String authorName;

    @Column(name = "raw_content", columnDefinition = "MEDIUMTEXT")
    private String rawContent;

    @Column(name = "content_hash", length = 64)
    private String contentHash;

    @Column(name = "event_fingerprint", length = 64)
    private String eventFingerprint;

    @Column(name = "duplicate_of_id")
    private Long duplicateOfId;

    @Column(name = "raw_publish_time")
    private LocalDateTime rawPublishTime;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "admin_summary", columnDefinition = "TEXT")
    private String adminSummary;

    @Column(length = 500)
    private String highlight;

    @Column(name = "admin_highlight", length = 500)
    private String adminHighlight;

    @Column(length = 50)
    private String category;

    @Column(name = "admin_category", length = 50)
    private String adminCategory;

    @Column(length = 255)
    private String tags;

    @Column(name = "spicy_index")
    private Integer spicyIndex;

    @Column(name = "admin_spicy_index")
    private Integer adminSpicyIndex;

    @Column(name = "admin_featured", nullable = false)
    private Boolean adminFeatured = false;

    @Column(name = "admin_featured_rank")
    private Integer adminFeaturedRank;

    @Column(name = "admin_note", length = 500)
    private String adminNote;

    @Column(name = "admin_updated_at")
    private LocalDateTime adminUpdatedAt;

    @Column(nullable = false, length = 20)
    private String verdict;

    @Column(name = "drop_reason", length = 255)
    private String dropReason;

    @Column(name = "ai_model", length = 100)
    private String aiModel;

    @Column(name = "ai_prompt_version", length = 50)
    private String aiPromptVersion;

    @Column(name = "ingest_token_name", length = 50)
    private String ingestTokenName;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "first_seen_at", nullable = false)
    private LocalDateTime firstSeenAt;

    @Column(name = "last_seen_at", nullable = false)
    private LocalDateTime lastSeenAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getSourcePostId() {
        return sourcePostId;
    }

    public void setSourcePostId(String sourcePostId) {
        this.sourcePostId = sourcePostId;
    }

    public String getSourceUrl() {
        return sourceUrl;
    }

    public void setSourceUrl(String sourceUrl) {
        this.sourceUrl = sourceUrl;
    }

    public String getNormalizedUrl() {
        return normalizedUrl;
    }

    public void setNormalizedUrl(String normalizedUrl) {
        this.normalizedUrl = normalizedUrl;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAdminTitle() {
        return adminTitle;
    }

    public void setAdminTitle(String adminTitle) {
        this.adminTitle = adminTitle;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getRawContent() {
        return rawContent;
    }

    public void setRawContent(String rawContent) {
        this.rawContent = rawContent;
    }

    public String getContentHash() {
        return contentHash;
    }

    public void setContentHash(String contentHash) {
        this.contentHash = contentHash;
    }

    public String getEventFingerprint() {
        return eventFingerprint;
    }

    public void setEventFingerprint(String eventFingerprint) {
        this.eventFingerprint = eventFingerprint;
    }

    public Long getDuplicateOfId() {
        return duplicateOfId;
    }

    public void setDuplicateOfId(Long duplicateOfId) {
        this.duplicateOfId = duplicateOfId;
    }

    public LocalDateTime getRawPublishTime() {
        return rawPublishTime;
    }

    public void setRawPublishTime(LocalDateTime rawPublishTime) {
        this.rawPublishTime = rawPublishTime;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getAdminSummary() {
        return adminSummary;
    }

    public void setAdminSummary(String adminSummary) {
        this.adminSummary = adminSummary;
    }

    public String getHighlight() {
        return highlight;
    }

    public void setHighlight(String highlight) {
        this.highlight = highlight;
    }

    public String getAdminHighlight() {
        return adminHighlight;
    }

    public void setAdminHighlight(String adminHighlight) {
        this.adminHighlight = adminHighlight;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getAdminCategory() {
        return adminCategory;
    }

    public void setAdminCategory(String adminCategory) {
        this.adminCategory = adminCategory;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public Integer getSpicyIndex() {
        return spicyIndex;
    }

    public void setSpicyIndex(Integer spicyIndex) {
        this.spicyIndex = spicyIndex;
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

    public LocalDateTime getAdminUpdatedAt() {
        return adminUpdatedAt;
    }

    public void setAdminUpdatedAt(LocalDateTime adminUpdatedAt) {
        this.adminUpdatedAt = adminUpdatedAt;
    }

    public String getVerdict() {
        return verdict;
    }

    public void setVerdict(String verdict) {
        this.verdict = verdict;
    }

    public String getDropReason() {
        return dropReason;
    }

    public void setDropReason(String dropReason) {
        this.dropReason = dropReason;
    }

    public String getAiModel() {
        return aiModel;
    }

    public void setAiModel(String aiModel) {
        this.aiModel = aiModel;
    }

    public String getAiPromptVersion() {
        return aiPromptVersion;
    }

    public void setAiPromptVersion(String aiPromptVersion) {
        this.aiPromptVersion = aiPromptVersion;
    }

    public String getIngestTokenName() {
        return ingestTokenName;
    }

    public void setIngestTokenName(String ingestTokenName) {
        this.ingestTokenName = ingestTokenName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getFirstSeenAt() {
        return firstSeenAt;
    }

    public void setFirstSeenAt(LocalDateTime firstSeenAt) {
        this.firstSeenAt = firstSeenAt;
    }

    public LocalDateTime getLastSeenAt() {
        return lastSeenAt;
    }

    public void setLastSeenAt(LocalDateTime lastSeenAt) {
        this.lastSeenAt = lastSeenAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
