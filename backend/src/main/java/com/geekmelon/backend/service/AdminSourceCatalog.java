package com.geekmelon.backend.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public final class AdminSourceCatalog {

    private static final List<ManagedSourceDefinition> DEFINITIONS = List.of(
            new ManagedSourceDefinition("cls", "财联社 AI 专题", 8, 10, "cls_ai"),
            new ManagedSourceDefinition("qbitai", "量子位", 8, 20, "qbitai"),
            new ManagedSourceDefinition("kr36", "36氪热榜与快讯", 8, 30, "kr36"),
            new ManagedSourceDefinition("toutiao", "今日头条热榜", 8, 40, "toutiao_hot"),
            new ManagedSourceDefinition("juejin", "掘金 AI", 8, 50, "juejin_ai"),
            new ManagedSourceDefinition("jiqizhixin", "机器之心", 8, 60, "jiqizhixin")
    );

    private AdminSourceCatalog() {
    }

    public static List<ManagedSourceDefinition> definitions() {
        return DEFINITIONS;
    }

    public static ManagedSourceDefinition find(String sourceKey) {
        return DEFINITIONS.stream()
                .filter(definition -> definition.sourceKey().equals(sourceKey))
                .findFirst()
                .orElse(null);
    }

    public record ManagedSourceDefinition(
            String sourceKey,
            String displayName,
            int defaultMaxItems,
            int defaultRunOrder,
            String commandSource
    ) {
    }
}
