package com.cura.controller;

import com.cura.dto.VideoNoteDto;
import com.cura.service.VideoNoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/videos/{videoId}/notes")
@RequiredArgsConstructor
public class VideoNoteController {

    private final VideoNoteService videoNoteService;

    @GetMapping
    public ResponseEntity<List<VideoNoteDto.Response>> getNotes(
            @PathVariable Long videoId,
            @AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(videoNoteService.getNotesByVideoId(videoId, userId));
    }

    @PostMapping
    public ResponseEntity<VideoNoteDto.Response> createNote(
            @PathVariable Long videoId,
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody VideoNoteDto.CreateRequest request) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(videoNoteService.createNote(videoId, userId, request));
    }

    @PatchMapping("/{noteId}")
    public ResponseEntity<VideoNoteDto.Response> updateNote(
            @PathVariable Long videoId,
            @PathVariable Long noteId,
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody VideoNoteDto.UpdateRequest request) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(videoNoteService.updateNote(noteId, userId, request));
    }

    @DeleteMapping("/{noteId}")
    public ResponseEntity<Void> deleteNote(
            @PathVariable Long videoId,
            @PathVariable Long noteId,
            @AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        videoNoteService.deleteNote(noteId, userId);
        return ResponseEntity.noContent().build();
    }
}
