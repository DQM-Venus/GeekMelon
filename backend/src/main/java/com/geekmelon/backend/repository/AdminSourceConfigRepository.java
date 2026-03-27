package com.geekmelon.backend.repository;

import com.geekmelon.backend.entity.AdminSourceConfig;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdminSourceConfigRepository extends JpaRepository<AdminSourceConfig, String> {

    List<AdminSourceConfig> findAllByOrderByRunOrderAscDisplayNameAsc();
}
