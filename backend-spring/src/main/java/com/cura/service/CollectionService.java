package com.cura.service;

import com.cura.dto.CollectionDto;
import com.cura.dto.CommonDto;
import com.cura.dto.VideoDto;
import com.cura.exception.ResourceNotFoundException;
import com.cura.model.Collection;
import com.cura.model.Video;
import com.cura.model.VideoCategory;
import com.cura.repository.CollectionRepository;
import com.cura.repository.VideoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CollectionService {

        private final CollectionRepository collectionRepository;
        private final VideoRepository videoRepository;
        private final VideoService videoService;
        private final YouTubeService youTubeService;

        @Transactional
        public CollectionDto.Response createCollection(UUID userId, CollectionDto.CreateRequest request) {
                Collection collection = Collection.builder()
                                .userId(userId) // Save ownership
                                .type(request.getType())
                                .title(request.getTitle())
                                .description(request.getDescription())
                                .coverImageUrl(request.getCoverImageUrl())
                                .profileImageUrl(request.getProfileImageUrl())
                                .officialLink(request.getOfficialLink())
                                .build();

                Collection saved = collectionRepository.save(collection);
                return toResponse(saved);
        }

        public CollectionDto.Response getCollection(Long id) {
                Collection collection = collectionRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Collection not found with id: " + id));
                return toResponse(collection);
        }

        public CollectionDto.SliceResponse getAllCollections(UUID userId, int page, int size) {
                // If userId is present, fetch ONLY that user's collections (My Collections)
                // If userId is null (or based on query param logic), we might want to fetch
                // public ones.
                // For now, let's implement the logic:
                // If userId is provided -> Fetch USER'S collections
                // If userId is NOT provided -> Fetch ALL collections (for backward
                // compatibility/admin/public feed?)
                // Based on user request "Private Ownership", logged in users should mostly see
                // their own.
                // But we might need a separate endpoint for "Community Feed".
                // Let's assume this endpoint is for "My Collections" if logged in?
                // Actually, the current home page uses this for the feed.
                // Let's assume:
                // - Null userId -> Return All (Admin/Public view??) OR Return Public Only?
                // - Valid userId -> Return ONLY that user's collections (for now, to test
                // ownership)

                Page<Collection> pageResult;
                if (userId != null) {
                        pageResult = collectionRepository.findByUserIdOrderByCreatedAtDesc(userId,
                                        PageRequest.of(page, size));
                } else {
                        // For privacy, anonymous users see nothing (or we could return only OFFICIAL
                        // types later)
                        pageResult = Page.empty(PageRequest.of(page, size));
                }

                List<CollectionDto.Response> content = pageResult.getContent().stream()
                                .map(this::toResponse)
                                .collect(Collectors.toList());

                return CollectionDto.SliceResponse.builder()
                                .content(content)
                                .last(pageResult.isLast())
                                .first(pageResult.isFirst())
                                .size(pageResult.getSize())
                                .number(pageResult.getNumber())
                                .numberOfElements(pageResult.getNumberOfElements())
                                .empty(pageResult.isEmpty())
                                .build();
        }

        @Transactional
        public CollectionDto.Response updateCollection(Long id, UUID userId, CollectionDto.UpdateRequest request) {
                Collection collection = collectionRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Collection not found with id: " + id));

                if (!collection.getUserId().equals(userId)) {
                        throw new ResourceNotFoundException("Collection not found with id: " + id); // Hide existence or
                                                                                                    // use Forbidden
                }

                Collection updated = Collection.builder()
                                .id(collection.getId())
                                .userId(collection.getUserId()) // FIX: Preserve userId!
                                .type(collection.getType())
                                .title(request.getTitle() != null ? request.getTitle() : collection.getTitle())
                                .description(request.getDescription() != null ? request.getDescription()
                                                : collection.getDescription())
                                .coverImageUrl(
                                                request.getCoverImageUrl() != null ? request.getCoverImageUrl()
                                                                : collection.getCoverImageUrl())
                                .profileImageUrl(request.getProfileImageUrl() != null ? request.getProfileImageUrl()
                                                : collection.getProfileImageUrl())
                                .officialLink(
                                                request.getOfficialLink() != null ? request.getOfficialLink()
                                                                : collection.getOfficialLink())
                                .createdAt(collection.getCreatedAt())
                                .videos(collection.getVideos())
                                .build();

                Collection saved = collectionRepository.save(updated);
                return toResponse(saved);
        }

        @Transactional
        public void deleteCollection(Long id, UUID userId) {
                Collection collection = collectionRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Collection not found with id: " + id));

                if (!collection.getUserId().equals(userId)) {
                        throw new ResourceNotFoundException("Collection not found with id: " + id);
                }
                collectionRepository.delete(collection);
        }

        public List<CollectionDto.Response> searchCollections(String query) {
                return collectionRepository.findByTitleContainingIgnoreCase(query)
                                .stream()
                                .map(this::toResponse)
                                .collect(Collectors.toList());
        }

        public CommonDto.StatsResponse getStats() {
                long totalCollections = collectionRepository.count();
                long totalVideos = videoRepository.count();

                Map<VideoCategory, Long> categoryDistribution = new HashMap<>();
                for (VideoCategory category : VideoCategory.values()) {
                        long count = videoRepository.findByCategory(category).size();
                        categoryDistribution.put(category, count);
                }

                List<VideoDto.Response> recentVideos = videoService.getRecentVideos(10);

                return CommonDto.StatsResponse.builder()
                                .totalCollections(totalCollections)
                                .totalVideos(totalVideos)
                                .categoryDistribution(categoryDistribution)
                                .recentVideos(recentVideos)
                                .build();
        }

        private CollectionDto.Response toResponse(Collection collection) {
                return CollectionDto.Response.builder()
                                .id(collection.getId())
                                .type(collection.getType())
                                .title(collection.getTitle())
                                .description(collection.getDescription())
                                .coverImageUrl(collection.getCoverImageUrl())
                                .profileImageUrl(collection.getProfileImageUrl())
                                .officialLink(collection.getOfficialLink())
                                .createdAt(collection.getCreatedAt())
                                .videoCount(videoRepository.countByCollectionId(collection.getId()))
                                .build();
        }

        @Transactional
        public int claimLegacyCollections(UUID userId) {
                return collectionRepository.updateUserIdForOrphanCollections(userId);
        }
}
