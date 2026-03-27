ALTER TABLE ai_news_feed
    ADD COLUMN admin_title VARCHAR(300) NULL COMMENT '后台运营覆盖标题' AFTER title,
    ADD COLUMN admin_highlight VARCHAR(500) NULL COMMENT '后台运营覆盖爆点' AFTER highlight,
    ADD COLUMN admin_summary TEXT NULL COMMENT '后台运营覆盖摘要' AFTER summary,
    ADD COLUMN admin_category VARCHAR(50) NULL COMMENT '后台运营覆盖分类' AFTER category,
    ADD COLUMN admin_spicy_index INT NULL COMMENT '后台运营覆盖吃瓜指数' AFTER spicy_index,
    ADD COLUMN admin_featured TINYINT(1) NOT NULL DEFAULT 0 COMMENT '后台人工精选' AFTER admin_spicy_index,
    ADD COLUMN admin_featured_rank INT NULL COMMENT '后台人工精选排序' AFTER admin_featured,
    ADD COLUMN admin_note VARCHAR(500) NULL COMMENT '后台运营备注' AFTER admin_featured_rank,
    ADD COLUMN admin_updated_at DATETIME NULL COMMENT '后台运营更新时间' AFTER admin_note;

CREATE INDEX idx_ai_news_feed_admin_featured
    ON ai_news_feed (admin_featured, admin_featured_rank, admin_updated_at);

CREATE TABLE admin_source_config (
    source_key VARCHAR(50) NOT NULL COMMENT '来源标识',
    display_name VARCHAR(100) NOT NULL COMMENT '来源展示名',
    enabled TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用',
    max_items INT NOT NULL DEFAULT 8 COMMENT '单次抓取数量',
    run_order INT NOT NULL DEFAULT 100 COMMENT '手动抓取排序',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (source_key)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '后台来源配置';

CREATE TABLE admin_task_run_log (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
    source_key VARCHAR(50) NOT NULL COMMENT '来源标识',
    trigger_type VARCHAR(20) NOT NULL COMMENT '触发方式',
    status VARCHAR(20) NOT NULL COMMENT '运行状态',
    started_at DATETIME NOT NULL COMMENT '开始时间',
    ended_at DATETIME NULL COMMENT '结束时间',
    created_count INT NOT NULL DEFAULT 0 COMMENT '新增数量',
    updated_count INT NOT NULL DEFAULT 0 COMMENT '更新数量',
    skipped_count INT NOT NULL DEFAULT 0 COMMENT '跳过数量',
    filtered_count INT NOT NULL DEFAULT 0 COMMENT '过滤数量',
    error_message VARCHAR(1000) NULL COMMENT '错误信息',
    PRIMARY KEY (id),
    KEY idx_admin_task_run_log_source_started (source_key, started_at DESC),
    KEY idx_admin_task_run_log_status_started (status, started_at DESC)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '后台任务运行日志';

INSERT INTO admin_source_config (source_key, display_name, enabled, max_items, run_order, updated_at)
VALUES
    ('cls', '财联社 AI 专题', 1, 8, 10, NOW()),
    ('qbitai', '量子位', 1, 8, 20, NOW()),
    ('kr36', '36氪热榜与快讯', 1, 8, 30, NOW()),
    ('toutiao', '今日头条热榜', 1, 8, 40, NOW()),
    ('juejin', '掘金 AI', 1, 8, 50, NOW()),
    ('jiqizhixin', '机器之心', 0, 8, 60, NOW())
ON DUPLICATE KEY UPDATE
    display_name = VALUES(display_name),
    enabled = VALUES(enabled),
    max_items = VALUES(max_items),
    run_order = VALUES(run_order),
    updated_at = VALUES(updated_at);
