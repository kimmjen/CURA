package com.cura.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "watch_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WatchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "video_id", nullable = false)
    private Video video;

    @Column(name = "watched_at", nullable = false)
    private LocalDateTime watchedAt;

    @Column(name = "progress_seconds", nullable = false)
    @Builder.Default
    private Integer progressSeconds = 0;

    @Column(name = "duration_seconds", nullable = false)
    @Builder.Default
    private Integer durationSeconds = 0;

    @Column(name = "is_completed", nullable = false)
    @Builder.Default
    private Boolean isCompleted = false;

    @Column(name = "last_position_seconds", nullable = false)
    @Builder.Default
    private Integer lastPositionSeconds = 0;

    @PrePersist
    protected void onCreate() {
        if (watchedAt == null) {
            watchedAt = LocalDateTime.now();
        }
        if (isCompleted == null) {
            isCompleted = false;
        }
    }
}
