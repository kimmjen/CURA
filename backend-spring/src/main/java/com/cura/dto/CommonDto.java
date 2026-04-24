package com.cura.dto;

import com.cura.model.VideoCategory;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class CommonDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StatsResponse {
        private Long totalCollections;
        private Long totalVideos;
        private Map<VideoCategory, Long> categoryDistribution;
        private List<VideoDto.Response> recentVideos;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UploadResponse {
        private String url;
        @Builder.Default
        private String message = "Upload successful";
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ErrorResponse {
        private String message;
        private Integer status;
        @Builder.Default
        private String timestamp = LocalDateTime.now().toString();
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ImportVideosResponse {
        private Integer imported;
        private Integer skipped;
        private Integer total;
        private List<VideoDto.Response> videos;
    }
}
