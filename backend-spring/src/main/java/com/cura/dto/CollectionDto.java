package com.cura.dto;

import com.cura.model.CollectionType;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

public class CollectionDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {
        @Builder.Default
        private CollectionType type = CollectionType.USER;

        @NotBlank(message = "Title is required")
        private String title;

        private String description;
        private String coverImageUrl;
        private String profileImageUrl;
        private String officialLink;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateRequest {
        private String title;
        private String description;
        private String coverImageUrl;
        private String profileImageUrl;
        private String officialLink;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private CollectionType type;
        private String title;
        private String description;
        private String coverImageUrl;
        private String profileImageUrl;
        private String officialLink;
        private LocalDateTime createdAt;
        @Builder.Default
        private Long videoCount = 0L;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ListResponse {
        private List<Response> collections;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SliceResponse {
        private List<Response> content;
        private boolean last;
        private boolean first;
        private int size;
        private int number;
        private int numberOfElements;
        private boolean empty;
    }
}
