package com.cura.service;

import com.cura.dto.WatchHistoryDto;
import com.cura.model.Video;
import com.cura.model.WatchHistory;
import com.cura.repository.VideoRepository;
import com.cura.repository.WatchHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class WatchHistoryService {

    private final WatchHistoryRepository watchHistoryRepository;
    private final VideoRepository videoRepository;

    /**
     * 시청 기록 저장/업데이트
     */
    @Transactional
    public WatchHistoryDto.Response saveWatchHistory(UUID userId, WatchHistoryDto.SaveRequest request) {
        log.info("Saving watch history for user: {}, video: {}", userId, request.getVideoId());

        Video video = videoRepository.findById(request.getVideoId())
                .orElseThrow(() -> new RuntimeException("Video not found: " + request.getVideoId()));

        // 기존 기록 찾기 또는 새로 생성
        WatchHistory history = watchHistoryRepository
                .findByUserIdAndVideoId(userId, request.getVideoId())
                .orElse(WatchHistory.builder()
                        .userId(userId)
                        .video(video)
                        .progressSeconds(0)
                        .durationSeconds(request.getDurationSeconds())
                        .build());

        // 업데이트
        history.setWatchedAt(LocalDateTime.now());
        history.setProgressSeconds(request.getProgressSeconds());
        history.setLastPositionSeconds(request.getLastPositionSeconds());

        // 80% 이상 시청 시 완료로 표시
        boolean isCompleted = request.getProgressSeconds() >= request.getDurationSeconds() * 0.8;
        history.setIsCompleted(isCompleted);

        WatchHistory saved = watchHistoryRepository.save(history);
        log.info("Watch history saved: id={}, isCompleted={}", saved.getId(), saved.getIsCompleted());

        return WatchHistoryDto.Response.from(saved);
    }

    /**
     * 최근 시청 목록 조회
     */
    @Transactional(readOnly = true)
    public Page<WatchHistoryDto.Response> getRecentHistory(UUID userId, int page, int size) {
        log.info("Getting recent history for user: {}, page: {}, size: {}", userId, page, size);

        Pageable pageable = PageRequest.of(page, size);
        return watchHistoryRepository.findByUserIdOrderByWatchedAtDesc(userId, pageable)
                .map(WatchHistoryDto.Response::from);
    }

    /**
     * 새 비디오 배지 카운트 (7일 이내 추가된 미시청 영상)
     */
    @Transactional(readOnly = true)
    public Long getNewVideoBadgeCount(UUID userId) {
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        Long count = watchHistoryRepository.countNewVideosForUser(userId, weekAgo);
        log.info("New video badge count for user {}: {}", userId, count);
        return count;
    }

    /**
     * 특정 시청 기록 삭제
     */
    @Transactional
    public void deleteWatchHistory(UUID userId, Long videoId) {
        log.info("Deleting watch history for user: {}, video: {}", userId, videoId);

        watchHistoryRepository.findByUserIdAndVideoId(userId, videoId)
                .ifPresent(history -> {
                    watchHistoryRepository.delete(history);
                    log.info("Watch history deleted: id={}", history.getId());
                });
    }

    /**
     * 전체 시청 기록 삭제
     */
    @Transactional
    public void clearAllHistory(UUID userId) {
        log.info("Clearing all watch history for user: {}", userId);

        Page<WatchHistory> allHistory = watchHistoryRepository
                .findByUserIdOrderByWatchedAtDesc(userId, Pageable.unpaged());

        watchHistoryRepository.deleteAll(allHistory.getContent());
        log.info("All watch history cleared for user: {}", userId);
    }
}
