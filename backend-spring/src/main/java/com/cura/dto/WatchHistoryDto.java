package com.cura.dto;

import com.cura.model.WatchHistory;
import lombok.*;

import java.time.LocalDateTime;

public class WatchHistoryDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SaveRequest {
        private Long videoId;
        private Integer progressSeconds;
        private Integer durationSeconds;
        private Integer lastPositionSeconds;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private VideoDto video;
        private LocalDateTime watchedAt;
        private Integer progressSeconds;
        private Integer durationSeconds;
        private Boolean isCompleted;
        private Integer lastPositionSeconds;

        public static Response from(WatchHistory history) {
            return Response.builder()
                    .id(history.getId())
                    .video(VideoDto.from(history.getVideo()))
                    .watchedAt(history.getWatchedAt())
                    .progressSeconds(history.getProgressSeconds())
                    .durationSeconds(history.getDurationSeconds())
                    .isCompleted(history.getIsCompleted())
                    .lastPositionSeconds(history.getLastPositionSeconds())
                    .build();
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VideoDto {
        private Long id;
        private String youtubeVideoId;
        private String title;
        private String thumbnailUrl;
        private String channelName;
        private Integer durationSeconds;
        private LocalDateTime publishedAt;
        private String category;
        private Long collectionId;

        public static VideoDto from(com.cura.model.Video video) {
            return VideoDto.builder()
                    .id(video.getId())
                    .youtubeVideoId(video.getYoutubeVideoId())
                    .title(video.getTitle())
                    .thumbnailUrl(video.getThumbnailUrl())
                    .channelName(video.getChannelName())
                    .durationSeconds(video.getDurationSeconds())
                    .publishedAt(video.getPublishedAt())
                    .category(video.getCategory() != null ? video.getCategory().name() : "ETC")
                    .collectionId(video.getCollection() != null ? video.getCollection().getId() : null)
                    .build();
        }
    }
}
