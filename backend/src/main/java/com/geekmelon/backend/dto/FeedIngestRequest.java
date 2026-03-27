package com.geekmelon.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;
import java.util.List;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record FeedIngestRequest(
        @NotBlank(message = "source 不能为空")
        @Size(max = 50, message = "source 长度不能超过 50")
        String source,

        @NotBlank(message = "source_post_id 不能为空")
        @Size(max = 128, message = "source_post_id 长度不能超过 128")
        String sourcePostId,

        @NotBlank(message = "source_url 不能为空")
        @Size(max = 500, message = "source_url 长度不能超过 500")
        String sourceUrl,

        @Size(max = 500, message = "normalized_url 长度不能超过 500")
        String normalizedUrl,

        @NotBlank(message = "title 不能为空")
        @Size(max = 300, message = "title 长度不能超过 300")
        String title,

        @Size(max = 100, message = "author_name 长度不能超过 100")
        String authorName,

        String rawContent,

        @Size(max = 64, message = "content_hash 长度不能超过 64")
        String contentHash,

        @Size(max = 64, message = "event_fingerprint 长度不能超过 64")
        String eventFingerprint,

        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
        OffsetDateTime rawPublishTime,

        String summary,

        @Size(max = 500, message = "highlight 长度不能超过 500")
        String highlight,

        @Size(max = 50, message = "category 长度不能超过 50")
        String category,

        List<@Size(max = 50, message = "单个标签长度不能超过 50") String> tags,

        @NotNull(message = "spicy_index 不能为空")
        @Min(value = 1, message = "spicy_index 不能小于 1")
        @Max(value = 10, message = "spicy_index 不能大于 10")
        Integer spicyIndex,

        @NotBlank(message = "verdict 不能为空")
        @Size(max = 20, message = "verdict 长度不能超过 20")
        @Pattern(regexp = "keep|drop", message = "verdict 只允许为 keep 或 drop")
        String verdict,

        @Size(max = 255, message = "drop_reason 长度不能超过 255")
        String dropReason,

        @Size(max = 100, message = "ai_model 长度不能超过 100")
        String aiModel,

        @Size(max = 50, message = "ai_prompt_version 长度不能超过 50")
        String aiPromptVersion
) {
}
