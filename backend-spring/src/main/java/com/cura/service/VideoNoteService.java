package com.cura.service;

import com.cura.dto.VideoNoteDto;
import com.cura.exception.ResourceNotFoundException;
import com.cura.model.Video;
import com.cura.model.VideoNote;
import com.cura.repository.VideoNoteRepository;
import com.cura.repository.VideoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VideoNoteService {

    private final VideoNoteRepository videoNoteRepository;
    private final VideoRepository videoRepository;

    public List<VideoNoteDto.Response> getNotesByVideoId(Long videoId, UUID userId) {
        return videoNoteRepository.findByVideoIdAndUserIdOrderByCreatedAtAsc(videoId, userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public VideoNoteDto.Response createNote(Long videoId, UUID userId, VideoNoteDto.CreateRequest request) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new ResourceNotFoundException("Video not found with id: " + videoId));

        VideoNote note = VideoNote.builder()
                .video(video)
                .userId(userId)
                .content(request.getContent())
                .timestampSeconds(request.getTimestampSeconds())
                .build();

        VideoNote saved = videoNoteRepository.save(note);
        return toResponse(saved);
    }

    @Transactional
    public VideoNoteDto.Response updateNote(Long noteId, UUID userId, VideoNoteDto.UpdateRequest request) {
        VideoNote note = videoNoteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with id: " + noteId));

        if (!note.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Note not found with id: " + noteId);
        }

        if (request.getContent() != null) {
            note.setContent(request.getContent());
        }
        if (request.getTimestampSeconds() != null) {
            note.setTimestampSeconds(request.getTimestampSeconds());
        }

        VideoNote saved = videoNoteRepository.save(note);
        return toResponse(saved);
    }

    @Transactional
    public void deleteNote(Long noteId, UUID userId) {
        VideoNote note = videoNoteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with id: " + noteId));

        if (!note.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Note not found with id: " + noteId);
        }

        videoNoteRepository.delete(note);
    }

    private VideoNoteDto.Response toResponse(VideoNote note) {
        return VideoNoteDto.Response.builder()
                .id(note.getId())
                .videoId(note.getVideo().getId())
                .content(note.getContent())
                .timestampSeconds(note.getTimestampSeconds())
                .createdAt(note.getCreatedAt())
                .updatedAt(note.getUpdatedAt())
                .build();
    }
}
