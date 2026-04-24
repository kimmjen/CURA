package com.cura.service;

import com.cura.dto.YouTubeDto;
import com.cura.exception.ExternalApiException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Slf4j
public class YouTubeService {

    private final String apiKey;
    private final WebClient webClient;
    private static final String YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";

    public YouTubeService(@Value("${youtube.api-key}") String apiKey) {
        this.apiKey = apiKey;
        this.webClient = WebClient.builder().baseUrl(YOUTUBE_API_BASE_URL).build();
    }

    public String extractVideoId(String youtubeUrl) {
        List<Pattern> patterns = Arrays.asList(
                Pattern.compile("(?:youtube\\.com/watch\\?v=|youtu\\.be/)([a-zA-Z0-9_-]{11})"),
                Pattern.compile("youtube\\.com/embed/([a-zA-Z0-9_-]{11})"),
                Pattern.compile("youtube\\.com/v/([a-zA-Z0-9_-]{11})"));

        for (Pattern pattern : patterns) {
            Matcher matcher = pattern.matcher(youtubeUrl);
            if (matcher.find()) {
                return matcher.group(1);
            }
        }

        if (youtubeUrl.matches("[a-zA-Z0-9_-]{11}")) {
            return youtubeUrl;
        }

        throw new IllegalArgumentException("Invalid YouTube URL: " + youtubeUrl);
    }

    public String extractChannelId(String url) {
        if (url == null || url.isEmpty()) {
            throw new IllegalArgumentException("URL cannot be empty");
        }

        // Pattern for channel URL: youtube.com/channel/UC...
        Pattern channelPattern = Pattern.compile("youtube\\.com/channel/(UC[a-zA-Z0-9_-]+)");
        Matcher matcher = channelPattern.matcher(url);
        if (matcher.find()) {
            return matcher.group(1);
        }

        // Pattern for handle URL: youtube.com/@username
        Pattern handlePattern = Pattern.compile("youtube\\.com/@([a-zA-Z0-9_-]+)");
        matcher = handlePattern.matcher(url);
        if (matcher.find()) {
            String handle = matcher.group(1);
            // Resolve handle to channel ID using YouTube API
            return resolveHandleToChannelId(handle);
        }

        // Pattern for custom URL: youtube.com/c/customname
        Pattern customPattern = Pattern.compile("youtube\\.com/c/([a-zA-Z0-9_-]+)");
        matcher = customPattern.matcher(url);
        if (matcher.find()) {
            String customName = matcher.group(1);
            return resolveHandleToChannelId(customName);
        }

        // Return as is if it looks like a channel ID
        if (url.startsWith("UC") && url.length() == 24) {
            return url;
        }

        throw new IllegalArgumentException("Could not extract Channel ID from URL: " + url);
    }

    @SuppressWarnings("unchecked")
    private String resolveHandleToChannelId(String handle) {
        try {
            Map<String, Object> response = webClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/channels")
                            .queryParam("part", "id")
                            .queryParam("forHandle", handle)
                            .queryParam("key", apiKey)
                            .build())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            List<Map<String, Object>> items = (List<Map<String, Object>>) response.get("items");
            if (items == null || items.isEmpty()) {
                throw new IllegalArgumentException("No channel found for handle: @" + handle);
            }

            return (String) items.get(0).get("id");
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to resolve channel handle: @" + handle + " - " + e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    public YouTubeDto.VideoInfo getVideoInfo(String videoId) {
        try {
            Map<String, Object> response = webClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/videos")
                            .queryParam("part", "snippet,contentDetails")
                            .queryParam("id", videoId)
                            .queryParam("key", apiKey)
                            .build())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            List<Map<String, Object>> items = (List<Map<String, Object>>) response.get("items");
            if (items == null || items.isEmpty()) {
                throw new ExternalApiException("No video found for ID: " + videoId);
            }

            Map<String, Object> item = items.get(0);
            Map<String, Object> snippet = (Map<String, Object>) item.get("snippet");
            Map<String, Object> contentDetails = (Map<String, Object>) item.get("contentDetails");

            String title = (String) snippet.get("title");
            String description = (String) snippet.get("description");
            String channelName = (String) snippet.get("channelTitle");
            Map<String, Object> thumbnails = (Map<String, Object>) snippet.get("thumbnails");
            String thumbnailUrl = getThumbnailUrl(thumbnails);
            String publishedAtStr = (String) snippet.get("publishedAt");
            String duration = (String) contentDetails.get("duration");

            return YouTubeDto.VideoInfo.builder()
                    .videoId(videoId)
                    .title(title)
                    .description(description)
                    .channelName(channelName)
                    .thumbnailUrl(thumbnailUrl)
                    .durationSeconds(parseDuration(duration))
                    .publishedAt(parsePublishedDate(publishedAtStr))
                    .build();

        } catch (WebClientResponseException e) {
            throw new ExternalApiException("YouTube API error: " + e.getMessage());
        } catch (Exception e) {
            throw new ExternalApiException("Failed to fetch video info: " + e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    public List<String> getChannelVideos(String channelId, int maxResults) {
        try {
            Map<String, Object> response = webClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/search")
                            .queryParam("part", "id")
                            .queryParam("channelId", channelId)
                            .queryParam("maxResults", maxResults)
                            .queryParam("order", "date")
                            .queryParam("type", "video")
                            .queryParam("key", apiKey)
                            .build())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            List<Map<String, Object>> items = (List<Map<String, Object>>) response.get("items");
            if (items == null) {
                return List.of();
            }

            return items.stream()
                    .map(item -> (Map<String, Object>) item.get("id"))
                    .map(id -> (String) id.get("videoId"))
                    .filter(id -> id != null)
                    .collect(Collectors.toList());

        } catch (WebClientResponseException e) {
            throw new ExternalApiException("YouTube API error: " + e.getMessage());
        } catch (Exception e) {
            throw new ExternalApiException("Failed to fetch channel videos: " + e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    public YouTubeDto.ChannelInfo getChannelInfo(String channelId) {
        try {
            Map<String, Object> response = webClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/channels")
                            .queryParam("part", "snippet,statistics")
                            .queryParam("id", channelId)
                            .queryParam("key", apiKey)
                            .build())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            List<Map<String, Object>> items = (List<Map<String, Object>>) response.get("items");
            if (items == null || items.isEmpty()) {
                throw new ExternalApiException("No channel found for ID: " + channelId);
            }

            Map<String, Object> item = items.get(0);
            Map<String, Object> snippet = (Map<String, Object>) item.get("snippet");
            Map<String, Object> statistics = (Map<String, Object>) item.get("statistics");

            String channelName = (String) snippet.get("title");
            String description = (String) snippet.get("description");
            Map<String, Object> thumbnails = (Map<String, Object>) snippet.get("thumbnails");
            String thumbnailUrl = getThumbnailUrl(thumbnails);
            String videoCountStr = (String) statistics.get("videoCount");
            int videoCount = videoCountStr != null ? Integer.parseInt(videoCountStr) : 0;

            return YouTubeDto.ChannelInfo.builder()
                    .channelId(channelId)
                    .channelName(channelName)
                    .description(description)
                    .thumbnailUrl(thumbnailUrl)
                    .videoCount(videoCount)
                    .build();

        } catch (WebClientResponseException e) {
            throw new ExternalApiException("YouTube API error: " + e.getMessage());
        } catch (Exception e) {
            throw new ExternalApiException("Failed to fetch channel info: " + e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    private String getThumbnailUrl(Map<String, Object> thumbnails) {
        for (String quality : Arrays.asList("high", "medium", "default")) {
            Map<String, Object> thumbnail = (Map<String, Object>) thumbnails.get(quality);
            if (thumbnail != null) {
                return (String) thumbnail.get("url");
            }
        }
        return "";
    }

    private Integer parseDuration(String duration) {
        Pattern pattern = Pattern.compile("PT(?:(\\d+)H)?(?:(\\d+)M)?(?:(\\d+)S)?");
        Matcher matcher = pattern.matcher(duration);
        if (!matcher.find()) {
            return 0;
        }

        int hours = matcher.group(1) != null ? Integer.parseInt(matcher.group(1)) : 0;
        int minutes = matcher.group(2) != null ? Integer.parseInt(matcher.group(2)) : 0;
        int seconds = matcher.group(3) != null ? Integer.parseInt(matcher.group(3)) : 0;

        return hours * 3600 + minutes * 60 + seconds;
    }

    private LocalDateTime parsePublishedDate(String dateString) {
        return ZonedDateTime.parse(dateString, DateTimeFormatter.ISO_DATE_TIME).toLocalDateTime();
    }

    public String extractPlaylistId(String url) {
        if (url == null || url.isEmpty()) {
            throw new IllegalArgumentException("URL cannot be empty");
        }

        // Pattern for playlist URL: youtube.com/playlist?list=PLxxxxx
        Pattern playlistPattern = Pattern.compile("[?&]list=([a-zA-Z0-9_-]+)");
        Matcher matcher = playlistPattern.matcher(url);
        if (matcher.find()) {
            return matcher.group(1);
        }

        // Return as is if it looks like a playlist ID (starts with PL, RD, etc.)
        if (url.matches("^(PL|RD|UU|LL|FL|OL)[a-zA-Z0-9_-]+$")) {
            return url;
        }

        throw new IllegalArgumentException("Could not extract Playlist ID from URL: " + url);
    }

    @SuppressWarnings("unchecked")
    public List<String> getPlaylistVideos(String playlistId, int maxResults) {
        try {
            Map<String, Object> response = webClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/playlistItems")
                            .queryParam("part", "contentDetails")
                            .queryParam("playlistId", playlistId)
                            .queryParam("maxResults", maxResults)
                            .queryParam("key", apiKey)
                            .build())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            List<Map<String, Object>> items = (List<Map<String, Object>>) response.get("items");
            if (items == null) {
                return List.of();
            }

            return items.stream()
                    .map(item -> (Map<String, Object>) item.get("contentDetails"))
                    .map(details -> (String) details.get("videoId"))
                    .filter(id -> id != null)
                    .collect(Collectors.toList());

        } catch (WebClientResponseException e) {
            throw new ExternalApiException("YouTube API error: " + e.getMessage());
        } catch (Exception e) {
            throw new ExternalApiException("Failed to fetch playlist videos: " + e.getMessage());
        }
    }
}
