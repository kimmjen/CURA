package com.cura.controller;

import com.cura.dto.CommonDto;
import com.cura.service.CollectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final CollectionService collectionService;

    @GetMapping
    public ResponseEntity<CommonDto.StatsResponse> getStats() {
        return ResponseEntity.ok(collectionService.getStats());
    }
}
