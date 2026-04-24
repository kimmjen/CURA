package com.cura.controller;

import com.cura.dto.VideoDto;
import com.cura.service.VideoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
public class VideoController {

    private final VideoService videoService;

    @GetMapping("/{id}")
    public ResponseEntity<VideoDto.Response> getVideo(@PathVariable Long id) {
        return ResponseEntity.ok(videoService.getVideo(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<VideoDto.Response> updateVideo(
            @PathVariable Long id,
            @Valid @RequestBody VideoDto.UpdateRequest request) {
        return ResponseEntity.ok(videoService.updateVideo(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVideo(@PathVariable Long id) {
        videoService.deleteVideo(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/batch-delete")
    public ResponseEntity<Void> batchDeleteVideos(@RequestBody VideoDto.BatchDeleteRequest request) {
        videoService.batchDeleteVideos(request);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/trending")
    public ResponseEntity<VideoDto.ListResponse> getTrendingVideos(
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(videoService.getTrendingVideos(limit));
    }

    @GetMapping("/recent")
    public ResponseEntity<VideoDto.ListResponse> getRecentVideos(
            @RequestParam(defaultValue = "20") int limit) {
        var videos = videoService.getRecentVideos(limit);
        return ResponseEntity.ok(VideoDto.ListResponse.builder()
                .videos(videos)
                .total((long) videos.size())
                .page(1)
                .pageSize(limit)
                .build());
    }

    @PostMapping("/{id}/sync")
    public ResponseEntity<VideoDto.Response> refreshVideoMetadata(@PathVariable Long id) {
        return ResponseEntity.ok(videoService.refreshVideoMetadata(id));
    }

    @PostMapping("/sync-all")
    public ResponseEntity<Void> refreshAllVideos() {
        videoService.refreshAllVideos();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/collection/{collectionId}/sync-channel")
    public ResponseEntity<Integer> syncChannelVideos(@PathVariable Long collectionId) {
        int addedCount = videoService.syncChannelVideos(collectionId);
        return ResponseEntity.ok(addedCount);
    }

    @PostMapping("/collection/{collectionId}/import-channel")
    public ResponseEntity<VideoDto.ImportChannelResponse> importChannelVideos(
            @PathVariable Long collectionId,
            @RequestBody VideoDto.ImportChannelRequest request) {
        int addedCount = videoService.importChannelVideos(collectionId, request.getChannelUrl(),
                request.getDefaultCategory());
        return ResponseEntity.ok(VideoDto.ImportChannelResponse.builder()
                .addedCount(addedCount)
                .message(addedCount + " videos imported from channel")
                .build());
    }

    @PostMapping("/collection/{collectionId}/import-playlist")
    public ResponseEntity<VideoDto.ImportPlaylistResponse> importPlaylistVideos(
            @PathVariable Long collectionId,
            @RequestBody VideoDto.ImportPlaylistRequest request) {
        int addedCount = videoService.importPlaylistVideos(collectionId, request.getPlaylistUrl(),
                request.getDefaultCategory());
        return ResponseEntity.ok(VideoDto.ImportPlaylistResponse.builder()
                .addedCount(addedCount)
                .message(addedCount + " videos imported from playlist")
                .build());
    }
}
