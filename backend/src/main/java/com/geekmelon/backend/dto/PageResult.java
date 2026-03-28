package com.geekmelon.backend.dto;

import java.util.List;

public record PageResult<T>(
        List<T> records,
        long total,
        int page,
        int pageSize,
        int totalPages,
        String effectiveDateScope,
        String effectiveDate,
        Boolean emptyFallback
) {

    public PageResult(List<T> records, long total, int page, int pageSize, int totalPages) {
        this(records, total, page, pageSize, totalPages, null, null, null);
    }
}
