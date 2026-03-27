package com.geekmelon.backend.repository;

import com.geekmelon.backend.entity.AiNewsFeed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AiNewsFeedRepository extends JpaRepository<AiNewsFeed, Long>, JpaSpecificationExecutor<AiNewsFeed> {

    Optional<AiNewsFeed> findBySourceAndSourcePostId(String source, String sourcePostId);

    Optional<AiNewsFeed> findFirstByEventFingerprintAndDuplicateOfIdIsNullAndStatusOrderByCreatedAtAsc(
            String eventFingerprint,
            String status
    );

    List<AiNewsFeed> findAllByDuplicateOfIdAndStatusOrderByCreatedAtAsc(Long duplicateOfId, String status);

    List<AiNewsFeed> findAllByAdminFeaturedTrueAndStatusOrderByAdminFeaturedRankAscAdminUpdatedAtDesc(String status);

    long countByStatus(String status);

    long countByCreatedAtAfter(LocalDateTime createdAt);

    long countByAdminFeaturedTrueAndStatus(String status);
}
