ALTER TABLE ai_news_feed
    ADD COLUMN event_fingerprint VARCHAR(64) DEFAULT NULL COMMENT '事件指纹' AFTER content_hash,
    ADD COLUMN duplicate_of_id BIGINT DEFAULT NULL COMMENT '主记录 ID' AFTER event_fingerprint;

ALTER TABLE ai_news_feed
    ADD KEY idx_event_fingerprint (event_fingerprint),
    ADD KEY idx_duplicate_of_id (duplicate_of_id);

UPDATE ai_news_feed
SET event_fingerprint = SHA2(
        LOWER(
            TRIM(
                REPLACE(
                    REPLACE(
                        REPLACE(IFNULL(title, ''), 'openai', ''),
                        'marktechpost',
                        ''
                    ),
                    'arxiv',
                    ''
                )
            )
        ),
        256
    )
WHERE event_fingerprint IS NULL;
