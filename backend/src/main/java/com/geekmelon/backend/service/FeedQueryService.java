package com.geekmelon.backend.service;

import com.geekmelon.backend.dto.FeedDetailResponse;
import com.geekmelon.backend.dto.FeedListItemResponse;
import com.geekmelon.backend.dto.PageResult;
import com.geekmelon.backend.dto.RelatedSourceItemResponse;
import com.geekmelon.backend.entity.AiNewsFeed;
import com.geekmelon.backend.exception.BizException;
import com.geekmelon.backend.repository.AiNewsFeedRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
public class FeedQueryService {

    private static final int HOMEPAGE_DIVERSITY_WINDOW = 6;
    private static final int DIVERSITY_SCAN_WINDOW = 8;
    private static final ZoneId SHANGHAI_ZONE = ZoneId.of("Asia/Shanghai");

    private final AiNewsFeedRepository aiNewsFeedRepository;
    private final HomepageEditorialService homepageEditorialService;
    private final FeedDisplayTextService feedDisplayTextService;

    public FeedQueryService(
            AiNewsFeedRepository aiNewsFeedRepository,
            HomepageEditorialService homepageEditorialService,
            FeedDisplayTextService feedDisplayTextService
    ) {
        this.aiNewsFeedRepository = aiNewsFeedRepository;
        this.homepageEditorialService = homepageEditorialService;
        this.feedDisplayTextService = feedDisplayTextService;
    }

    public PageResult<FeedListItemResponse> list(
            Integer page,
            Integer pageSize,
            String source,
            String category,
            Integer minSpicyIndex,
            String dateScope,
            boolean fetchAll,
            String sort
    ) {
        int safePage = page == null || page < 1 ? 1 : page;
        int safePageSize = pageSize == null || pageSize < 1 ? 10 : Math.min(pageSize, 50);
        String normalizedDateScope = normalizeDateScope(safePage, source, category, minSpicyIndex, dateScope);
        boolean homepageRequest = isHomepageRequest(safePage, source, category, minSpicyIndex, normalizedDateScope);

        List<FeedListItemResponse> allRecords = buildPublicRecords(
                source,
                category,
                minSpicyIndex,
                normalizedDateScope,
                sort,
                homepageRequest
        );
        int total = allRecords.size();
        if (fetchAll) {
            int effectivePageSize = total == 0 ? safePageSize : total;
            return new PageResult<>(allRecords, total, 1, effectivePageSize, total == 0 ? 0 : 1);
        }

        int totalPages = total == 0 ? 0 : (int) Math.ceil((double) total / safePageSize);
        int fromIndex = Math.min((safePage - 1) * safePageSize, total);
        int toIndex = Math.min(fromIndex + safePageSize, total);

        List<FeedListItemResponse> records = allRecords.subList(fromIndex, toIndex);
        return new PageResult<>(records, total, safePage, safePageSize, totalPages);
    }

    public FeedDetailResponse detail(Long id) {
        AiNewsFeed entity = aiNewsFeedRepository.findById(id)
                .filter(feed -> "active".equals(feed.getStatus()))
                .orElseThrow(() -> new BizException(404, "内容不存在"));
        return toDetail(entity, buildRelatedSources(entity));
    }

    public Set<Long> resolveAutomaticEditorialIds() {
        List<FeedListItemResponse> automaticCandidates = buildAutomaticEditorialBase("latest", "yesterday");
        return automaticCandidates.stream()
                .filter(item -> Boolean.TRUE.equals(item.editorPick()))
                .map(FeedListItemResponse::id)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
    }

    private List<FeedListItemResponse> buildPublicRecords(
            String source,
            String category,
            Integer minSpicyIndex,
            String dateScope,
            String sort,
            boolean homepageRequest
    ) {
        boolean hasSourceFilter = StringUtils.hasText(source);
        List<AiNewsFeed> feeds = queryActiveFeeds(source, category, minSpicyIndex, !hasSourceFilter);
        feeds = applyDateScope(feeds, dateScope);

        List<AiNewsFeed> workingFeeds = feeds;
        List<FeedListItemResponse> leadingFeatured = List.of();

        if (homepageRequest) {
            List<AiNewsFeed> featuredFeeds = applyDateScope(queryFeaturedFeeds(), dateScope);
            Set<Long> featuredIds = featuredFeeds.stream()
                    .map(AiNewsFeed::getId)
                    .collect(LinkedHashSet::new, Set::add, Set::addAll);
            leadingFeatured = featuredFeeds.stream().map(this::toListItem).toList();
            workingFeeds = workingFeeds.stream()
                    .filter(feed -> !featuredIds.contains(feed.getId()))
                    .toList();
        }

        List<AiNewsFeed> sortedFeeds = workingFeeds.stream()
                .sorted(buildComparator(sort))
                .toList();

        if (!hasSourceFilter) {
            sortedFeeds = diversifyFeeds(sortedFeeds);
        }

        List<FeedListItemResponse> records = sortedFeeds.stream()
                .map(this::toListItem)
                .toList();

        if (homepageRequest) {
            records = homepageEditorialService.apply(records, sort);
            if (!leadingFeatured.isEmpty()) {
                List<FeedListItemResponse> merged = new ArrayList<>(leadingFeatured);
                merged.addAll(records);
                records = merged;
            }
        }

        return records;
    }

    private List<FeedListItemResponse> buildAutomaticEditorialBase(String sort, String dateScope) {
        List<AiNewsFeed> featuredFeeds = applyDateScope(queryFeaturedFeeds(), dateScope);
        Set<Long> featuredIds = featuredFeeds.stream()
                .map(AiNewsFeed::getId)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);
        List<AiNewsFeed> feeds = applyDateScope(queryActiveFeeds(null, null, null, true), dateScope)
                .stream()
                .filter(feed -> !featuredIds.contains(feed.getId()))
                .sorted(buildComparator(sort))
                .toList();
        List<AiNewsFeed> diversified = diversifyFeeds(feeds);
        return homepageEditorialService.apply(diversified.stream().map(this::toListItem).toList(), sort);
    }

    private String normalizeDateScope(
            Integer page,
            String source,
            String category,
            Integer minSpicyIndex,
            String dateScope
    ) {
        if (StringUtils.hasText(dateScope)) {
            return "yesterday".equalsIgnoreCase(dateScope.trim()) ? "yesterday" : null;
        }
        return isHomepageRequest(page, source, category, minSpicyIndex, "yesterday") ? "yesterday" : null;
    }

    private boolean isHomepageRequest(
            Integer page,
            String source,
            String category,
            Integer minSpicyIndex,
            String dateScope
    ) {
        return page == 1
                && !StringUtils.hasText(source)
                && !StringUtils.hasText(category)
                && (minSpicyIndex == null || minSpicyIndex <= 0)
                && "yesterday".equals(dateScope);
    }

    private List<AiNewsFeed> queryActiveFeeds(
            String source,
            String category,
            Integer minSpicyIndex,
            boolean filterDuplicateRoots
    ) {
        Specification<AiNewsFeed> specification = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.equal(root.get("status"), "active"));
            if (filterDuplicateRoots) {
                predicates.add(criteriaBuilder.isNull(root.get("duplicateOfId")));
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
            if (minSpicyIndex != null && minSpicyIndex > 0) {
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.greaterThanOrEqualTo(root.get("spicyIndex"), minSpicyIndex),
                        criteriaBuilder.greaterThanOrEqualTo(root.get("adminSpicyIndex"), minSpicyIndex)
                ));
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
        return aiNewsFeedRepository.findAll(specification);
    }

    private List<AiNewsFeed> queryFeaturedFeeds() {
        return aiNewsFeedRepository.findAllByAdminFeaturedTrueAndStatusOrderByAdminFeaturedRankAscAdminUpdatedAtDesc("active");
    }

    private List<AiNewsFeed> applyDateScope(List<AiNewsFeed> feeds, String dateScope) {
        if (!"yesterday".equals(dateScope)) {
            return feeds;
        }

        LocalDate yesterday = LocalDate.now(SHANGHAI_ZONE).minusDays(1);
        LocalDateTime start = yesterday.atStartOfDay();
        LocalDateTime end = start.plusDays(1);

        return feeds.stream()
                .filter(feed -> {
                    LocalDateTime effectiveTime = effectiveCreatedAt(feed);
                    return effectiveTime != null
                            && !effectiveTime.isBefore(start)
                            && effectiveTime.isBefore(end);
                })
                .toList();
    }

    private List<AiNewsFeed> diversifyFeeds(List<AiNewsFeed> feeds) {
        if (feeds.size() <= 2) {
            return feeds;
        }

        List<AiNewsFeed> remaining = new ArrayList<>(feeds);
        List<AiNewsFeed> diversified = new ArrayList<>(feeds.size());

        while (!remaining.isEmpty()) {
            int candidateIndex = selectCandidateIndex(diversified, remaining);
            diversified.add(remaining.remove(candidateIndex));
        }

        return diversified;
    }

    private int selectCandidateIndex(List<AiNewsFeed> selected, List<AiNewsFeed> remaining) {
        int scanLimit = Math.min(remaining.size(), DIVERSITY_SCAN_WINDOW);
        Set<String> leadingSources = selected.stream()
                .limit(HOMEPAGE_DIVERSITY_WINDOW)
                .map(AiNewsFeed::getSource)
                .collect(HashSet::new, Set::add, Set::addAll);
        boolean shouldPreferNewSource = selected.size() < HOMEPAGE_DIVERSITY_WINDOW && leadingSources.size() < 3;

        if (shouldPreferNewSource) {
            for (int index = 0; index < scanLimit; index++) {
                AiNewsFeed candidate = remaining.get(index);
                if (!leadingSources.contains(candidate.getSource()) && !wouldCreateThreeStreak(selected, candidate)) {
                    return index;
                }
            }
        }

        for (int index = 0; index < scanLimit; index++) {
            if (!wouldCreateThreeStreak(selected, remaining.get(index))) {
                return index;
            }
        }

        for (int index = 0; index < remaining.size(); index++) {
            if (!wouldCreateThreeStreak(selected, remaining.get(index))) {
                return index;
            }
        }

        return 0;
    }

    private boolean wouldCreateThreeStreak(List<AiNewsFeed> selected, AiNewsFeed candidate) {
        int size = selected.size();
        if (size < 2) {
            return false;
        }
        return Objects.equals(selected.get(size - 1).getSource(), candidate.getSource())
                && Objects.equals(selected.get(size - 2).getSource(), candidate.getSource());
    }

    private Comparator<AiNewsFeed> buildComparator(String sort) {
        Comparator<AiNewsFeed> latestComparator = Comparator
                .comparingInt(this::sourceWeight).reversed()
                .thenComparing(this::effectiveCreatedAt, Comparator.nullsLast(Comparator.reverseOrder()))
                .thenComparing(this::effectiveSpicyIndex, Comparator.reverseOrder());

        if ("spicy".equalsIgnoreCase(sort)) {
            return Comparator
                    .comparingInt(this::effectiveSpicyIndex).reversed()
                    .thenComparing(this::sourceWeight, Comparator.reverseOrder())
                    .thenComparing(this::effectiveCreatedAt, Comparator.nullsLast(Comparator.reverseOrder()));
        }

        return latestComparator;
    }

    private int sourceWeight(AiNewsFeed entity) {
        return switch (entity.getSource()) {
            case "cls" -> 100;
            case "qbitai" -> 95;
            case "kr36" -> 90;
            case "jiqizhixin" -> 88;
            case "toutiao" -> 80;
            case "rss" -> 70;
            case "juejin" -> 55;
            default -> 60;
        };
    }

    private int effectiveSpicyIndex(AiNewsFeed entity) {
        return entity.getAdminSpicyIndex() != null
                ? entity.getAdminSpicyIndex()
                : (entity.getSpicyIndex() == null ? 0 : entity.getSpicyIndex());
    }

    private LocalDateTime effectiveCreatedAt(AiNewsFeed entity) {
        return entity.getRawPublishTime() == null ? entity.getCreatedAt() : entity.getRawPublishTime();
    }

    private FeedListItemResponse toListItem(AiNewsFeed entity) {
        String displayTitle = entity.getAdminTitle() != null
                ? entity.getAdminTitle()
                : feedDisplayTextService.buildDisplayTitle(entity.getTitle());
        String displayHighlight = entity.getAdminHighlight();
        String displaySummary = entity.getAdminSummary() != null
                ? entity.getAdminSummary()
                : feedDisplayTextService.buildDisplaySummary(entity.getSummary(), entity.getHighlight());
        boolean adminEdited = entity.getAdminTitle() != null
                || entity.getAdminHighlight() != null
                || entity.getAdminSummary() != null
                || entity.getAdminCategory() != null
                || entity.getAdminSpicyIndex() != null;

        return new FeedListItemResponse(
                entity.getId(),
                entity.getSource(),
                entity.getSourceUrl(),
                entity.getTitle(),
                entity.getAuthorName(),
                entity.getSummary(),
                entity.getHighlight(),
                entity.getCategory(),
                splitTags(entity.getTags()),
                effectiveSpicyIndex(entity),
                entity.getRawPublishTime(),
                entity.getCreatedAt(),
                displayTitle,
                displayHighlight,
                displaySummary,
                adminEdited,
                null,
                Boolean.TRUE.equals(entity.getAdminFeatured())
        );
    }

    private FeedDetailResponse toDetail(AiNewsFeed entity, List<RelatedSourceItemResponse> relatedSources) {
        return new FeedDetailResponse(
                entity.getId(),
                entity.getSource(),
                entity.getSourcePostId(),
                entity.getSourceUrl(),
                entity.getTitle(),
                entity.getAuthorName(),
                entity.getRawContent(),
                entity.getRawPublishTime(),
                entity.getSummary(),
                entity.getHighlight(),
                entity.getCategory(),
                splitTags(entity.getTags()),
                entity.getSpicyIndex(),
                entity.getVerdict(),
                entity.getDropReason(),
                entity.getAiModel(),
                entity.getAiPromptVersion(),
                entity.getStatus(),
                entity.getCreatedAt(),
                entity.getUpdatedAt(),
                relatedSources
        );
    }

    private List<RelatedSourceItemResponse> buildRelatedSources(AiNewsFeed entity) {
        Long primaryId = entity.getDuplicateOfId() == null ? entity.getId() : entity.getDuplicateOfId();
        List<RelatedSourceItemResponse> relatedSources = new ArrayList<>();

        if (entity.getDuplicateOfId() != null) {
            aiNewsFeedRepository.findById(primaryId)
                    .filter(feed -> "active".equals(feed.getStatus()))
                    .filter(feed -> !Objects.equals(feed.getId(), entity.getId()))
                    .map(feed -> toRelatedSourceItem(feed, true))
                    .ifPresent(relatedSources::add);
        }

        List<RelatedSourceItemResponse> siblingSources = aiNewsFeedRepository
                .findAllByDuplicateOfIdAndStatusOrderByCreatedAtAsc(primaryId, "active")
                .stream()
                .filter(feed -> !Objects.equals(feed.getId(), entity.getId()))
                .map(feed -> toRelatedSourceItem(feed, false))
                .toList();
        relatedSources.addAll(siblingSources);
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
}
