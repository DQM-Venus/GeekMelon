package com.geekmelon.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class FeedDisplayTextService {

    private static final Pattern BRACKET_TITLE_PATTERN = Pattern.compile("^[【\\[]([^】\\]]+)[】\\]]");
    private static final Pattern MEDIA_PREFIX_PATTERN = Pattern.compile(
            "^(财联社|新华社|新华每日电讯|科创板日报|中新经纬|36氪|今日头条)\\d{1,2}月\\d{1,2}日(电|讯)[，,:：]?\\s*"
    );
    private static final Pattern QUOTED_MEDIA_PREFIX_PATTERN = Pattern.compile("^《[^》]+》\\d{1,2}日(讯|电)[，,:：]?\\s*");
    private static final Pattern ROUNDUP_PREFIX_PATTERN = Pattern.compile("^(\\d+点\\d+氪|今日|本周|早报|晚报|日报|周报)[丨|:：]");
    private static final Pattern SUMMARY_LINE_PATTERN = Pattern.compile("^\\d+[.、]\\s*");
    private static final int MAX_DISPLAY_TITLE_LENGTH = 34;
    private static final int MIN_COMPRESSION_DELTA = 6;
    private static final int MAX_DISPLAY_SUMMARY_LENGTH = 78;

    public String buildDisplayTitle(String title) {
        if (!StringUtils.hasText(title)) {
            return null;
        }

        String normalized = normalize(title);
        String compressed = tryExtractBracketTitle(normalized);
        if (!StringUtils.hasText(compressed)) {
            compressed = stripMediaPrefix(normalized);
        }
        compressed = stripRoundupPrefix(compressed);
        compressed = stripDecorations(compressed);

        if (compressed.length() > MAX_DISPLAY_TITLE_LENGTH) {
            compressed = firstMeaningfulClause(compressed);
        }
        if (compressed.length() > MAX_DISPLAY_TITLE_LENGTH) {
            compressed = compressed.substring(0, MAX_DISPLAY_TITLE_LENGTH).trim();
        }

        compressed = stripDecorations(compressed);
        if (!StringUtils.hasText(compressed)) {
            return null;
        }
        if (compressed.length() >= normalized.length() - MIN_COMPRESSION_DELTA) {
            return null;
        }
        return compressed;
    }

    public String buildDisplaySummary(String summary, String highlight) {
        List<String> summaryLines = extractSummaryLines(summary);
        List<String> pickedLines = new ArrayList<>();

        for (String line : summaryLines) {
            if (pickedLines.size() >= 2) {
                break;
            }
            if (isPlaceholderLine(line)) {
                continue;
            }
            pickedLines.add(line);
        }

        if (pickedLines.isEmpty() && StringUtils.hasText(highlight)) {
            pickedLines.add(stripDecorations(normalize(highlight)));
        }

        if (pickedLines.isEmpty()) {
            return null;
        }

        String joined = String.join(" ", pickedLines);
        joined = joined.replaceAll("\\s+", " ").trim();
        if (joined.length() > MAX_DISPLAY_SUMMARY_LENGTH) {
            joined = joined.substring(0, MAX_DISPLAY_SUMMARY_LENGTH).trim();
        }
        return joined;
    }

    private List<String> extractSummaryLines(String summary) {
        List<String> lines = new ArrayList<>();
        if (!StringUtils.hasText(summary)) {
            return lines;
        }

        String[] rawLines = summary.split("\\R");
        for (String rawLine : rawLines) {
            String normalizedLine = normalize(rawLine);
            normalizedLine = SUMMARY_LINE_PATTERN.matcher(normalizedLine).replaceFirst("").trim();
            normalizedLine = stripDecorations(normalizedLine);
            if (StringUtils.hasText(normalizedLine)) {
                lines.add(normalizedLine);
            }
        }
        return lines;
    }

    private boolean isPlaceholderLine(String line) {
        return line.contains("等待模型补充")
                || line.contains("等待 DeepSeek")
                || line.contains("当前页面未提供更多摘要")
                || line.contains("标题本身已经体现主要信息");
    }

    private String tryExtractBracketTitle(String title) {
        Matcher matcher = BRACKET_TITLE_PATTERN.matcher(title);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return null;
    }

    private String stripMediaPrefix(String title) {
        String current = title;
        boolean changed = true;
        while (changed) {
            changed = false;
            String next = MEDIA_PREFIX_PATTERN.matcher(current).replaceFirst("");
            if (!next.equals(current)) {
                current = next;
                changed = true;
            }
            next = QUOTED_MEDIA_PREFIX_PATTERN.matcher(current).replaceFirst("");
            if (!next.equals(current)) {
                current = next;
                changed = true;
            }
        }
        return current.trim();
    }

    private String stripRoundupPrefix(String title) {
        return ROUNDUP_PREFIX_PATTERN.matcher(title).replaceFirst("").trim();
    }

    private String firstMeaningfulClause(String title) {
        String[] parts = title.split("[，,；;：:]");
        if (parts.length == 0) {
            return title;
        }

        String best = parts[0].trim();
        for (String part : parts) {
            String candidate = stripDecorations(part);
            if (!StringUtils.hasText(candidate)) {
                continue;
            }
            if (candidate.length() <= MAX_DISPLAY_TITLE_LENGTH) {
                return candidate;
            }
            if (candidate.length() > best.length()) {
                best = candidate;
            }
        }
        return best;
    }

    private String stripDecorations(String text) {
        String value = normalize(text);
        value = value.replaceFirst("^刚刚[，,:：]?", "").trim();
        value = value.replaceFirst("^据[^，,:：]{1,12}(透露|消息)[，,:：]?", "").trim();
        value = value.replaceFirst("^值得注意的是[，,:：]?", "").trim();
        return value.strip();
    }

    private String normalize(String text) {
        return text.replaceAll("\\s+", " ").trim();
    }
}
