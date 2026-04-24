package com.cura.dto;

import com.cura.model.VideoCategory;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class VideoDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {
        @NotBlank(message = "YouTube URL is required")
        private String youtubeUrl;

        @Builder.Default
        private VideoCategory category = VideoCategory.ETC;

        private String comment;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateRequest {
        private String title;
        private VideoCategory category;
        private String comment;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BatchDeleteRequest {
        private List<Long> videoIds;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private Long collectionId;
        private String youtubeVideoId;
        private String title;
        private String channelName;
        private String thumbnailUrl;
        private String description;
        private String comment;
        private VideoCategory category;
        private Integer durationSeconds;
        private LocalDateTime publishedAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ListResponse {
        private List<Response> videos;
        private Long total;
        private Integer page;
        private Integer pageSize;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ImportChannelRequest {
        @NotBlank(message = "Channel URL is required")
        private String channelUrl;

        @Builder.Default
        private VideoCategory defaultCategory = VideoCategory.ETC;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ImportChannelResponse {
        private int addedCount;
        private String message;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ImportPlaylistRequest {
        @NotBlank(message = "Playlist URL is required")
        private String playlistUrl;

        @Builder.Default
        private VideoCategory defaultCategory = VideoCategory.ETC;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ImportPlaylistResponse {
        private int addedCount;
        private String message;
    }
}
