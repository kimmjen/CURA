package com.cura.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

public class VideoNoteDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {
        @NotBlank(message = "Content is required")
        private String content;

        private Integer timestampSeconds;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateRequest {
        private String content;
        private Integer timestampSeconds;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private Long videoId;
        private String content;
        private Integer timestampSeconds;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
