package com.geekmelon.backend.dto;

import java.util.List;

public record PageResult<T>(
        List<T> records,
        long total,
        int page,
        int pageSize,
        int totalPages
) {
}
