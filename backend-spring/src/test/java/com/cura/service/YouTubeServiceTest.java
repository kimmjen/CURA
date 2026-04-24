package com.cura.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

/**
 * Unit tests for {@link YouTubeService} URL parsing.
 *
 * We instantiate the service directly with a dummy API key so the pure
 * regex helpers don't need Spring context or a live YouTube API.
 */
class YouTubeServiceTest {

    private final YouTubeService service = new YouTubeService("test-api-key");

    @Test
    void extractVideoId_parsesStandardWatchUrl() {
        assertEquals("dQw4w9WgXcQ",
                service.extractVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ"));
    }

    @Test
    void extractVideoId_parsesShortUrl() {
        assertEquals("dQw4w9WgXcQ",
                service.extractVideoId("https://youtu.be/dQw4w9WgXcQ"));
    }

    @Test
    void extractVideoId_parsesEmbedUrl() {
        assertEquals("dQw4w9WgXcQ",
                service.extractVideoId("https://www.youtube.com/embed/dQw4w9WgXcQ"));
    }

    @Test
    void extractVideoId_parsesLegacyVUrl() {
        assertEquals("dQw4w9WgXcQ",
                service.extractVideoId("https://www.youtube.com/v/dQw4w9WgXcQ"));
    }

    @Test
    void extractVideoId_ignoresExtraQueryParams() {
        assertEquals("dQw4w9WgXcQ",
                service.extractVideoId(
                        "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLabc&index=1"));
    }

    @Test
    void extractVideoId_acceptsBareVideoId() {
        assertEquals("dQw4w9WgXcQ", service.extractVideoId("dQw4w9WgXcQ"));
    }

    @Test
    void extractVideoId_rejectsMalformedInput() {
        assertThrows(IllegalArgumentException.class,
                () -> service.extractVideoId("https://example.com/not-youtube"));
        assertThrows(IllegalArgumentException.class,
                () -> service.extractVideoId("short"));
    }

    @Test
    void extractChannelId_parsesChannelUrl() {
        assertEquals("UCabcdefghijklmnopqrstuv",
                service.extractChannelId("https://www.youtube.com/channel/UCabcdefghijklmnopqrstuv"));
    }

    @Test
    void extractChannelId_acceptsBareChannelId() {
        // 24-char UC... id, passed through untouched
        String channelId = "UCabcdefghijklmnopqrstuv";
        assertEquals(channelId, service.extractChannelId(channelId));
    }

    @Test
    void extractChannelId_rejectsEmptyInput() {
        assertThrows(IllegalArgumentException.class,
                () -> service.extractChannelId(""));
        assertThrows(IllegalArgumentException.class,
                () -> service.extractChannelId(null));
    }
}
