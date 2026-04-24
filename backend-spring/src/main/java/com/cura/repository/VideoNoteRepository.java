package com.cura.repository;

import com.cura.model.VideoNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VideoNoteRepository extends JpaRepository<VideoNote, Long> {

    List<VideoNote> findByVideoIdAndUserIdOrderByTimestampSecondsAscCreatedAtDesc(Long videoId, UUID userId);

    List<VideoNote> findByVideoIdAndUserIdOrderByCreatedAtDesc(Long videoId, UUID userId);

    List<VideoNote> findByVideoIdAndUserIdOrderByCreatedAtAsc(Long videoId, UUID userId);

    void deleteByVideoIdAndUserId(Long videoId, UUID userId);
}
