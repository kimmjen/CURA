package com.cura.dto;

import lombok.*;

import java.time.LocalDateTime;

public class YouTubeDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VideoInfo {
        private String videoId;
        private String title;
        private String description;
        private String channelName;
        private String thumbnailUrl;
        private Integer durationSeconds;
        private LocalDateTime publishedAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChannelInfo {
        private String channelId;
        private String channelName;
        private String description;
        private String thumbnailUrl;
        private Integer videoCount;
    }
}
