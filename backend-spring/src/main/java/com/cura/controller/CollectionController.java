package com.cura.controller;

import com.cura.dto.CollectionDto;
import com.cura.dto.CommonDto;
import com.cura.dto.VideoDto;
import com.cura.dto.YouTubeDto;
import com.cura.service.CollectionService;
import com.cura.service.VideoService;
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
@RequestMapping("/api/collections")
@RequiredArgsConstructor
public class CollectionController {

    private final CollectionService collectionService;
    private final VideoService videoService;

    @GetMapping
    public ResponseEntity<CollectionDto.SliceResponse> getAllCollections(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        UUID userId = jwt != null ? UUID.fromString(jwt.getSubject()) : null;
        System.out.println(
                "[DEBUG] Getting collections - JWT: " + (jwt != null ? "present" : "NULL") + ", userId: " + userId);
        return ResponseEntity.ok(collectionService.getAllCollections(userId, page, size));
    }

    @PostMapping
    public ResponseEntity<CollectionDto.Response> createCollection(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CollectionDto.CreateRequest request) {
        System.out.println("[DEBUG] Creating collection - JWT subject: " + (jwt != null ? jwt.getSubject() : "NULL"));
        UUID userId = UUID.fromString(jwt.getSubject());
        System.out.println("[DEBUG] Creating collection - userId: " + userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(collectionService.createCollection(userId, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CollectionDto.Response> getCollection(@PathVariable Long id) {
        return ResponseEntity.ok(collectionService.getCollection(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CollectionDto.Response> updateCollection(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id,
            @RequestBody CollectionDto.UpdateRequest request) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(collectionService.updateCollection(id, userId, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCollection(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id) {
        UUID userId = UUID.fromString(jwt.getSubject());
        collectionService.deleteCollection(id, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/videos")
    public ResponseEntity<VideoDto.ListResponse> getCollectionVideos(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize) {
        return ResponseEntity.ok(videoService.getVideosByCollection(id, page, pageSize));
    }

    @PostMapping("/{id}/videos")
    public ResponseEntity<VideoDto.Response> addVideoToCollection(
            @PathVariable Long id,
            @Valid @RequestBody VideoDto.CreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(videoService.createVideo(id, request));
    }

    @PostMapping("/claim")
    public ResponseEntity<Integer> claimLegacyCollections(@AuthenticationPrincipal Jwt jwt) {
        try {
            UUID userId = UUID.fromString(jwt.getSubject());
            System.out.println("Claiming legacy collections for user: " + userId);
            int count = collectionService.claimLegacyCollections(userId);
            System.out.println("Claimed count: " + count);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
}
