package com.geekmelon.backend.service;

import com.geekmelon.backend.dto.AdminFeedDetailResponse;
import com.geekmelon.backend.dto.AdminFeedListItemResponse;
import com.geekmelon.backend.dto.AdminFeedUpdateRequest;
import com.geekmelon.backend.dto.PageResult;
import com.geekmelon.backend.dto.RelatedSourceItemResponse;
import com.geekmelon.backend.entity.AiNewsFeed;
import com.geekmelon.backend.exception.BizException;
import com.geekmelon.backend.repository.AiNewsFeedRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
public class AdminFeedService {

    private final AiNewsFeedRepository aiNewsFeedRepository;
    private final FeedQueryService feedQueryService;

    public AdminFeedService(AiNewsFeedRepository aiNewsFeedRepository, FeedQueryService feedQueryService) {
        this.aiNewsFeedRepository = aiNewsFeedRepository;
        this.feedQueryService = feedQueryService;
    }

    @Transactional(readOnly = true)
    public PageResult<AdminFeedListItemResponse> list(
            Integer page,
            Integer pageSize,
            String keyword,
            String source,
            String category,
            String status,
            Boolean editorPick,
            Boolean featured,
            Long duplicateGroup
    ) {
        int safePage = page == null || page < 1 ? 1 : page;
        int safePageSize = pageSize == null || pageSize < 1 ? 20 : Math.min(pageSize, 100);
        Long primaryGroupId = resolvePrimaryGroupId(duplicateGroup);

        Specification<AiNewsFeed> specification = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(keyword)) {
                String pattern = "%" + keyword.trim() + "%";
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.like(root.get("title"), pattern),
                        criteriaBuilder.like(root.get("adminTitle"), pattern),
                        criteriaBuilder.like(root.get("rawContent"), pattern),
                        criteriaBuilder.like(root.get("sourceUrl"), pattern)
                ));
            }
            if (StringUtils.hasText(source)) {
                predicates.add(criteriaBuilder.equal(root.get("source"), source.trim()));
            }
            if (StringUtils.hasText(category)) {
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.equal(root.get("category"), category.trim()),
                        criteriaBuilder.equal(root.get("adminCategory"), category.trim())
                ));
            }
            if (StringUtils.hasText(status)) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status.trim()));
            }
            if (featured != null) {
                predicates.add(criteriaBuilder.equal(root.get("adminFeatured"), featured));
            }
            if (primaryGroupId != null) {
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.equal(root.get("id"), primaryGroupId),
                        criteriaBuilder.equal(root.get("duplicateOfId"), primaryGroupId)
                ));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        Set<Long> editorPickIds = editorPick == null ? Set.of() : feedQueryService.resolveAutomaticEditorialIds();
        List<AiNewsFeed> feeds = aiNewsFeedRepository.findAll(specification)
                .stream()
                .filter(feed -> editorPick == null || editorPickIds.contains(feed.getId()) == editorPick)
                .sorted(Comparator
                        .comparing(this::sortByAdminUpdatedAt, Comparator.nullsLast(Comparator.reverseOrder()))
                        .thenComparing(AiNewsFeed::getUpdatedAt, Comparator.nullsLast(Comparator.reverseOrder()))
                        .thenComparing(AiNewsFeed::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();

        int total = feeds.size();
        int totalPages = total == 0 ? 0 : (int) Math.ceil((double) total / safePageSize);
        int fromIndex = Math.min((safePage - 1) * safePageSize, total);
        int toIndex = Math.min(fromIndex + safePageSize, total);

        List<AdminFeedListItemResponse> records = feeds.subList(fromIndex, toIndex)
                .stream()
                .map(feed -> toListItem(feed, editorPickIds.contains(feed.getId())))
                .toList();
        return new PageResult<>(records, total, safePage, safePageSize, totalPages);
    }

    @Transactional(readOnly = true)
    public AdminFeedDetailResponse detail(Long id) {
        AiNewsFeed entity = getRequiredFeed(id);
        Set<Long> editorPickIds = feedQueryService.resolveAutomaticEditorialIds();
        return toDetail(entity, editorPickIds.contains(entity.getId()), buildRelatedSources(entity));
    }

    @Transactional
    public AdminFeedDetailResponse update(Long id, AdminFeedUpdateRequest request) {
        AiNewsFeed entity = getRequiredFeed(id);
        LocalDateTime now = LocalDateTime.now();

        if (StringUtils.hasText(request.getStatus())) {
            String nextStatus = request.getStatus().trim();
            if (!List.of("active", "hidden").contains(nextStatus)) {
                throw new BizException(400, "状态只支持 active 或 hidden");
            }
            entity.setStatus(nextStatus);
        }

        if (request.getAdminTitle() != null) {
            entity.setAdminTitle(trimToNull(request.getAdminTitle()));
        }
        if (request.getAdminHighlight() != null) {
            entity.setAdminHighlight(trimToNull(request.getAdminHighlight()));
        }
        if (request.getAdminSummary() != null) {
            entity.setAdminSummary(trimToNull(request.getAdminSummary()));
        }
        if (request.getAdminCategory() != null) {
            entity.setAdminCategory(trimToNull(request.getAdminCategory()));
        }
        if (request.getAdminSpicyIndex() != null) {
            int spicyIndex = request.getAdminSpicyIndex();
            if (spicyIndex < 1 || spicyIndex > 10) {
                throw new BizException(400, "吃瓜指数必须在 1 到 10 之间");
            }
            entity.setAdminSpicyIndex(spicyIndex);
        }
        if (request.getAdminFeatured() != null) {
            entity.setAdminFeatured(request.getAdminFeatured());
            if (Boolean.FALSE.equals(request.getAdminFeatured())) {
                entity.setAdminFeaturedRank(null);
            }
        }
        if (request.getAdminFeaturedRank() != null) {
            entity.setAdminFeaturedRank(Math.max(1, request.getAdminFeaturedRank()));
        }
        if (request.getAdminNote() != null) {
            entity.setAdminNote(trimToNull(request.getAdminNote()));
        }
        entity.setAdminUpdatedAt(now);
        entity.setUpdatedAt(now);

        AiNewsFeed saved = aiNewsFeedRepository.save(entity);
        Set<Long> editorPickIds = feedQueryService.resolveAutomaticEditorialIds();
        return toDetail(saved, editorPickIds.contains(saved.getId()), buildRelatedSources(saved));
    }

    @Transactional
    public AdminFeedDetailResponse hide(Long id) {
        AdminFeedUpdateRequest request = new AdminFeedUpdateRequest();
        request.setStatus("hidden");
        return update(id, request);
    }

    @Transactional
    public AdminFeedDetailResponse restore(Long id) {
        AdminFeedUpdateRequest request = new AdminFeedUpdateRequest();
        request.setStatus("active");
        return update(id, request);
    }

    private AiNewsFeed getRequiredFeed(Long id) {
        return aiNewsFeedRepository.findById(id)
                .orElseThrow(() -> new BizException(404, "内容不存在"));
    }

    private LocalDateTime sortByAdminUpdatedAt(AiNewsFeed entity) {
        return entity.getAdminUpdatedAt() == null ? entity.getUpdatedAt() : entity.getAdminUpdatedAt();
    }

    private Long resolvePrimaryGroupId(Long duplicateGroup) {
        if (duplicateGroup == null) {
            return null;
        }
        return aiNewsFeedRepository.findById(duplicateGroup)
                .map(feed -> feed.getDuplicateOfId() == null ? feed.getId() : feed.getDuplicateOfId())
                .orElse(duplicateGroup);
    }

    private AdminFeedListItemResponse toListItem(AiNewsFeed entity, boolean editorPick) {
        return new AdminFeedListItemResponse(
                entity.getId(),
                entity.getSource(),
                entity.getSourceUrl(),
                entity.getTitle(),
                entity.getAdminTitle(),
                entity.getAuthorName(),
                entity.getCategory(),
                entity.getAdminCategory(),
                entity.getSpicyIndex(),
                entity.getAdminSpicyIndex(),
                entity.getStatus(),
                entity.getDuplicateOfId(),
                editorPick,
                Boolean.TRUE.equals(entity.getAdminFeatured()),
                entity.getAdminFeaturedRank(),
                entity.getRawPublishTime(),
                entity.getFirstSeenAt(),
                entity.getLastSeenAt(),
                entity.getCreatedAt(),
                entity.getUpdatedAt(),
                entity.getAdminUpdatedAt(),
                splitTags(entity.getTags())
        );
    }

    private AdminFeedDetailResponse toDetail(
            AiNewsFeed entity,
            boolean editorPick,
            List<RelatedSourceItemResponse> relatedSources
    ) {
        return new AdminFeedDetailResponse(
                entity.getId(),
                entity.getSource(),
                entity.getSourcePostId(),
                entity.getSourceUrl(),
                entity.getTitle(),
                entity.getAdminTitle(),
                entity.getAuthorName(),
                entity.getRawContent(),
                entity.getRawPublishTime(),
                entity.getSummary(),
                entity.getAdminSummary(),
                entity.getHighlight(),
                entity.getAdminHighlight(),
                entity.getCategory(),
                entity.getAdminCategory(),
                splitTags(entity.getTags()),
                entity.getSpicyIndex(),
                entity.getAdminSpicyIndex(),
                entity.getVerdict(),
                entity.getDropReason(),
                entity.getAiModel(),
                entity.getAiPromptVersion(),
                entity.getStatus(),
                entity.getDuplicateOfId(),
                editorPick,
                Boolean.TRUE.equals(entity.getAdminFeatured()),
                entity.getAdminFeaturedRank(),
                entity.getAdminNote(),
                entity.getFirstSeenAt(),
                entity.getLastSeenAt(),
                entity.getCreatedAt(),
                entity.getUpdatedAt(),
                entity.getAdminUpdatedAt(),
                relatedSources
        );
    }

    private List<RelatedSourceItemResponse> buildRelatedSources(AiNewsFeed entity) {
        Long primaryId = entity.getDuplicateOfId() == null ? entity.getId() : entity.getDuplicateOfId();
        List<RelatedSourceItemResponse> relatedSources = new ArrayList<>();

        if (entity.getDuplicateOfId() != null) {
            aiNewsFeedRepository.findById(primaryId)
                    .filter(feed -> !Objects.equals(feed.getId(), entity.getId()))
                    .map(feed -> toRelatedSourceItem(feed, true))
                    .ifPresent(relatedSources::add);
        }

        relatedSources.addAll(
                aiNewsFeedRepository.findAllByDuplicateOfIdAndStatusOrderByCreatedAtAsc(primaryId, entity.getStatus())
                        .stream()
                        .filter(feed -> !Objects.equals(feed.getId(), entity.getId()))
                        .map(feed -> toRelatedSourceItem(feed, false))
                        .toList()
        );
        return relatedSources;
    }

    private RelatedSourceItemResponse toRelatedSourceItem(AiNewsFeed entity, boolean primarySource) {
        return new RelatedSourceItemResponse(
                entity.getId(),
                entity.getSource(),
                entity.getSourceUrl(),
                entity.getTitle(),
                entity.getAuthorName(),
                entity.getSpicyIndex(),
                entity.getRawPublishTime(),
                entity.getCreatedAt(),
                primarySource
        );
    }

    private List<String> splitTags(String tags) {
        if (!StringUtils.hasText(tags)) {
            return List.of();
        }
        return Arrays.stream(tags.split(","))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .toList();
    }

    private String trimToNull(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        return value.trim();
    }
}
