package com.cura.repository;

import com.cura.model.WatchHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WatchHistoryRepository extends JpaRepository<WatchHistory, Long> {

    // 특정 사용자의 시청 기록 (최신순)
    Page<WatchHistory> findByUserIdOrderByWatchedAtDesc(UUID userId, Pageable pageable);

    // 특정 사용자의 특정 비디오 시청 기록
    Optional<WatchHistory> findByUserIdAndVideoId(UUID userId, Long videoId);

    // 새 비디오 카운트 (7일 이내 추가, 미시청)
    @Query("""
                SELECT COUNT(v.id)
                FROM Video v
                WHERE v.createdAt > :weekAgo
                AND v.id NOT IN (
                    SELECT wh.video.id
                    FROM WatchHistory wh
                    WHERE wh.userId = :userId
                )
            """)
    Long countNewVideosForUser(@Param("userId") UUID userId, @Param("weekAgo") LocalDateTime weekAgo);

    // 오래된 기록 삭제 (90일 이상)
    void deleteByWatchedAtBefore(LocalDateTime date);
}
