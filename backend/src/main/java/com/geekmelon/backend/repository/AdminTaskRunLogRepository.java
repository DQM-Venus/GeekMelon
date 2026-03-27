package com.geekmelon.backend.repository;

import com.geekmelon.backend.entity.AdminTaskRunLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AdminTaskRunLogRepository extends JpaRepository<AdminTaskRunLog, Long> {

    List<AdminTaskRunLog> findTop10ByOrderByStartedAtDesc();

    List<AdminTaskRunLog> findTop20ByOrderByStartedAtDesc();

    List<AdminTaskRunLog> findTop20ByOrderByStartedAtDescIdDesc();

    long countByStatus(String status);

    long countByStartedAtAfter(LocalDateTime startedAt);
}
