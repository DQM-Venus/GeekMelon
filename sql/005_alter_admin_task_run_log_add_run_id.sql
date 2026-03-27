ALTER TABLE admin_task_run_log
    ADD COLUMN run_id VARCHAR(36) NULL COMMENT '任务运行唯一标识' AFTER id,
    ADD COLUMN error_category VARCHAR(50) NULL COMMENT '错误分类' AFTER filtered_count,
    ADD COLUMN error_detail VARCHAR(1000) NULL COMMENT '错误详情' AFTER error_category;

UPDATE admin_task_run_log
SET run_id = COALESCE(run_id, REPLACE(UUID(), '-', ''))
WHERE run_id IS NULL;

UPDATE admin_task_run_log
SET run_id = INSERT(INSERT(INSERT(INSERT(run_id, 9, 0, '-'), 14, 0, '-'), 19, 0, '-'), 24, 0, '-')
WHERE CHAR_LENGTH(run_id) = 32;

UPDATE admin_task_run_log
SET error_detail = COALESCE(error_detail, error_message)
WHERE error_message IS NOT NULL AND error_detail IS NULL;

ALTER TABLE admin_task_run_log
    MODIFY COLUMN run_id VARCHAR(36) NOT NULL COMMENT '任务运行唯一标识';

CREATE INDEX idx_admin_task_run_log_run_id
    ON admin_task_run_log (run_id);
