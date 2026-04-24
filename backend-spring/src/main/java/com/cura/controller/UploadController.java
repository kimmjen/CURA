package com.cura.controller;

import com.cura.dto.CommonDto;
import com.cura.service.SupabaseStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class UploadController {

    private final SupabaseStorageService supabaseStorageService;

    @PostMapping("/image")
    public ResponseEntity<CommonDto.UploadResponse> uploadImage(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(supabaseStorageService.uploadImage(file));
    }
}
