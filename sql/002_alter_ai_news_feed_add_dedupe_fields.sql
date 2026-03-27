ALTER TABLE ai_news_feed
    ADD COLUMN normalized_url VARCHAR(500) DEFAULT NULL COMMENT '归一化后的链接' AFTER source_url,
    ADD COLUMN content_hash VARCHAR(64) DEFAULT NULL COMMENT '内容哈希' AFTER raw_content,
    ADD COLUMN first_seen_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '首次抓取时间' AFTER status,
    ADD COLUMN last_seen_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最近抓取时间' AFTER first_seen_at;

ALTER TABLE ai_news_feed
    ADD KEY idx_normalized_url (normalized_url),
    ADD KEY idx_content_hash (content_hash),
    ADD KEY idx_last_seen_at (last_seen_at);

UPDATE ai_news_feed
SET normalized_url = source_url,
    content_hash = SHA2(CONCAT(IFNULL(title, ''), '\n', IFNULL(raw_content, '')), 256),
    first_seen_at = created_at,
    last_seen_at = updated_at
WHERE normalized_url IS NULL
   OR content_hash IS NULL
   OR first_seen_at IS NULL
   OR last_seen_at IS NULL;
