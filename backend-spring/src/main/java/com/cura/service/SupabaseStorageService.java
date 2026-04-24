package com.cura.service;

import com.cura.dto.CommonDto;
import com.cura.exception.ExternalApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Service
@RequiredArgsConstructor
public class SupabaseStorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    @Value("${supabase.storage.bucket}")
    private String bucketName;

    public CommonDto.UploadResponse uploadImage(MultipartFile file) {
        try {
            WebClient webClient = WebClient.builder()
                    .baseUrl(supabaseUrl + "/storage/v1")
                    .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + supabaseKey)
                    .build();

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String filePath = bucketName + "/" + fileName;

            webClient.post()
                    .uri("/object/" + filePath)
                    .contentType(MediaType.parseMediaType(file.getContentType()))
                    .body(BodyInserters.fromValue(file.getBytes()))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            String publicUrl = supabaseUrl + "/storage/v1/object/public/" + filePath;

            return CommonDto.UploadResponse.builder()
                    .url(publicUrl)
                    .build();

        } catch (WebClientResponseException e) {
            throw new ExternalApiException("Supabase upload error: " + e.getMessage());
        } catch (Exception e) {
            throw new ExternalApiException("Failed to upload image: " + e.getMessage());
        }
    }
}
