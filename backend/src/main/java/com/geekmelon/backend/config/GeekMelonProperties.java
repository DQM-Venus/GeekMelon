package com.geekmelon.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "geekmelon")
public record GeekMelonProperties(Ingest ingest, Editorial editorial, Admin admin, Crawler crawler) {

    public record Ingest(String token) {
    }

    public record Editorial(
            boolean enabled,
            String apiKey,
            String baseUrl,
            String model,
            int requestTimeoutSeconds,
            int pickCount,
            int candidateCount,
            int cacheTtlSeconds
    ) {
    }

    public record Admin(String username, String password) {
    }

    public record Crawler(
            String pythonCommand,
            String workingDirectory,
            String runnerMode,
            String apiBaseUrl
    ) {
    }
}
