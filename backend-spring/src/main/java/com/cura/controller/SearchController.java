package com.cura.controller;

import com.cura.dto.CollectionDto;
import com.cura.dto.VideoDto;
import com.cura.service.CollectionService;
import com.cura.service.VideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final VideoService videoService;
    private final CollectionService collectionService;

    @GetMapping("/videos")
    public ResponseEntity<List<VideoDto.Response>> searchVideos(@RequestParam String q) {
        return ResponseEntity.ok(videoService.searchVideos(q));
    }

    @GetMapping("/collections")
    public ResponseEntity<List<CollectionDto.Response>> searchCollections(@RequestParam String q) {
        return ResponseEntity.ok(collectionService.searchCollections(q));
    }
}
