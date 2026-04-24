package com.cura.controller;

import com.cura.dto.WatchHistoryDto;
import com.cura.service.WatchHistoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/watch-history")
@RequiredArgsConstructor
public class WatchHistoryController {

    private final WatchHistoryService watchHistoryService;

    /**
     * 시청 기록 저장
     * POST /api/watch-history
     */
    @PostMapping
    public ResponseEntity<WatchHistoryDto.Response> saveWatchHistory(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody WatchHistoryDto.SaveRequest request) {
        String userIdStr = jwt.getSubject();
        log.info("POST /api/watch-history - userId: {}, videoId: {}", userIdStr, request.getVideoId());

        UUID userId = UUID.fromString(userIdStr);
        WatchHistoryDto.Response response = watchHistoryService.saveWatchHistory(userId, request);

        return ResponseEntity.ok(response);
    }

    /**
     * 최근 시청 목록 조회
     * GET /api/watch-history?page=0&size=20
     */
    @GetMapping
    public ResponseEntity<Page<WatchHistoryDto.Response>> getRecentHistory(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        String userIdStr = jwt.getSubject();
        log.info("GET /api/watch-history - userId: {}, page: {}, size: {}", userIdStr, page, size);

        UUID userId = UUID.fromString(userIdStr);
        Page<WatchHistoryDto.Response> history = watchHistoryService.getRecentHistory(userId, page, size);

        return ResponseEntity.ok(history);
    }

    /**
     * 새 비디오 배지 카운트
     * GET /api/watch-history/badge-count
     */
    @GetMapping("/badge-count")
    public ResponseEntity<Long> getNewVideoBadgeCount(
            @AuthenticationPrincipal Jwt jwt) {
        String userIdStr = jwt.getSubject();
        log.info("GET /api/watch-history/badge-count - userId: {}", userIdStr);

        UUID userId = UUID.fromString(userIdStr);
        Long count = watchHistoryService.getNewVideoBadgeCount(userId);

        return ResponseEntity.ok(count);
    }

    /**
     * 특정 시청 기록 삭제
     * DELETE /api/watch-history/{videoId}
     */
    @DeleteMapping("/{videoId}")
    public ResponseEntity<Void> deleteWatchHistory(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long videoId) {
        String userIdStr = jwt.getSubject();
        log.info("DELETE /api/watch-history/{} - userId: {}", videoId, userIdStr);

        UUID userId = UUID.fromString(userIdStr);
        watchHistoryService.deleteWatchHistory(userId, videoId);

        return ResponseEntity.noContent().build();
    }

    /**
     * 전체 시청 기록 삭제
     * DELETE /api/watch-history
     */
    @DeleteMapping
    public ResponseEntity<Void> clearAllHistory(
            @AuthenticationPrincipal Jwt jwt) {
        String userIdStr = jwt.getSubject();
        log.info("DELETE /api/watch-history - userId: {}", userIdStr);

        UUID userId = UUID.fromString(userIdStr);
        watchHistoryService.clearAllHistory(userId);

        return ResponseEntity.noContent().build();
    }
}
