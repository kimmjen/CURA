package com.cura.service;

import com.cura.dto.VideoDto;
import com.cura.dto.YouTubeDto;
import com.cura.exception.DuplicateResourceException;
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
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VideoService {

    private final VideoRepository videoRepository;
    private final CollectionRepository collectionRepository;
    private final YouTubeService youTubeService;

    @Transactional
    public VideoDto.Response createVideo(Long collectionId, VideoDto.CreateRequest request) {
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Collection not found with id: " + collectionId));

        String videoId = youTubeService.extractVideoId(request.getYoutubeUrl());

        videoRepository.findByYoutubeVideoId(videoId).ifPresent(v -> {
            throw new DuplicateResourceException("Video already exists: " + videoId);
        });

        YouTubeDto.VideoInfo youtubeInfo = youTubeService.getVideoInfo(videoId);
        VideoCategory category = request.getCategory() != VideoCategory.ETC
                ? request.getCategory()
                : autoCategorize(youtubeInfo.getTitle());

        Video video = Video.builder()
                .collection(collection)
                .youtubeVideoId(youtubeInfo.getVideoId())
                .title(youtubeInfo.getTitle())
                .channelName(youtubeInfo.getChannelName())
                .thumbnailUrl(youtubeInfo.getThumbnailUrl())
                .description(youtubeInfo.getDescription())
                .comment(request.getComment())
                .category(category)
                .durationSeconds(youtubeInfo.getDurationSeconds())
                .publishedAt(youtubeInfo.getPublishedAt())
                .build();

        Video savedVideo = videoRepository.save(video);
        return toResponse(savedVideo);
    }

    public VideoDto.Response getVideo(Long id) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Video not found with id: " + id));
        return toResponse(video);
    }

    public VideoDto.ListResponse getVideosByCollection(Long collectionId, int page, int pageSize) {
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<Video> videoPage = videoRepository.findByCollectionId(collectionId, pageable);

        List<VideoDto.Response> videos = videoPage.getContent().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return VideoDto.ListResponse.builder()
                .videos(videos)
                .total(videoPage.getTotalElements())
                .page(page)
                .pageSize(pageSize)
                .build();
    }

    @Transactional
    public VideoDto.Response updateVideo(Long id, VideoDto.UpdateRequest request) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Video not found with id: " + id));

        Video updatedVideo = Video.builder()
                .id(video.getId())
                .collection(video.getCollection())
                .youtubeVideoId(video.getYoutubeVideoId())
                .title(request.getTitle() != null ? request.getTitle() : video.getTitle())
                .channelName(video.getChannelName())
                .thumbnailUrl(video.getThumbnailUrl())
                .description(video.getDescription())
                .comment(request.getComment() != null ? request.getComment() : video.getComment())
                .category(request.getCategory() != null ? request.getCategory() : video.getCategory())
                .durationSeconds(video.getDurationSeconds())
                .publishedAt(video.getPublishedAt())
                .build();

        Video saved = videoRepository.save(updatedVideo);
        return toResponse(saved);
    }

    @Transactional
    public void deleteVideo(Long id) {
        if (!videoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Video not found with id: " + id);
        }
        videoRepository.deleteById(id);
    }

    @Transactional
    public void batchDeleteVideos(VideoDto.BatchDeleteRequest request) {
        request.getVideoIds().forEach(id -> {
            if (videoRepository.existsById(id)) {
                videoRepository.deleteById(id);
            }
        });
    }

    public List<VideoDto.Response> searchVideos(String query) {
        return videoRepository.searchVideos(query).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<VideoDto.Response> getRecentVideos(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return videoRepository.findRecentVideos(pageable).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public VideoDto.ListResponse getTrendingVideos(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<VideoDto.Response> videos = videoRepository.findTrendingVideos(pageable).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return VideoDto.ListResponse.builder()
                .videos(videos)
                .total((long) videos.size())
                .page(1)
                .pageSize(limit)
                .build();
    }

    private VideoCategory autoCategorize(String title) {
        String lower = title.toLowerCase();
        if (lower.contains("mv") || lower.contains("music video"))
            return VideoCategory.MV;
        if (lower.contains("live") || lower.contains("concert"))
            return VideoCategory.LIVE;
        if (lower.contains("interview") || lower.contains("인터뷰"))
            return VideoCategory.INTERVIEW;
        if (lower.contains("shorts") || lower.contains("short"))
            return VideoCategory.SHORTS;
        if (lower.contains("fancam") || lower.contains("직캠"))
            return VideoCategory.FANCAM;
        if (lower.contains("behind") || lower.contains("비하인드"))
            return VideoCategory.BEHIND;
        if (lower.contains("vlog") || lower.contains("브이로그"))
            return VideoCategory.VLOG;
        return VideoCategory.ETC;
    }

    private VideoDto.Response toResponse(Video video) {
        return VideoDto.Response.builder()
                .id(video.getId())
                .collectionId(video.getCollection().getId())
                .youtubeVideoId(video.getYoutubeVideoId())
                .title(video.getTitle())
                .channelName(video.getChannelName())
                .thumbnailUrl(video.getThumbnailUrl())
                .description(video.getDescription())
                .comment(video.getComment())
                .category(video.getCategory())
                .durationSeconds(video.getDurationSeconds())
                .publishedAt(video.getPublishedAt())
                .build();
    }

    @Transactional
    public VideoDto.Response refreshVideoMetadata(Long id) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Video not found with id: " + id));

        YouTubeDto.VideoInfo info = youTubeService.getVideoInfo(video.getYoutubeVideoId());

        video.setTitle(info.getTitle());
        video.setDescription(info.getDescription());
        video.setDurationSeconds(info.getDurationSeconds());
        video.setThumbnailUrl(info.getThumbnailUrl());
        video.setPublishedAt(info.getPublishedAt());
        // Channel name usually doesn't change, but can update
        video.setChannelName(info.getChannelName());

        Video saved = videoRepository.save(video);
        return toResponse(saved);
    }

    public void refreshAllVideos() {
        List<Video> videos = videoRepository.findAll();
        for (Video video : videos) {
            try {
                refreshVideoMetadata(video.getId());
                // Small delay to be gentle on API quota if needed, keeping it sync for now
            } catch (Exception e) {
                // Log and continue, don't stop the whole process
                System.err.println("Failed to refresh video " + video.getId() + ": " + e.getMessage());
            }
        }
    }

    @Transactional
    public int syncChannelVideos(Long collectionId) {
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Collection not found with id: " + collectionId));

        String officialLink = collection.getOfficialLink();
        if (officialLink == null || officialLink.isEmpty()) {
            throw new IllegalArgumentException("Collection does not have an official link (Channel URL)");
        }

        String channelId = youTubeService.extractChannelId(officialLink);
        // Fetch latest 20 videos
        List<String> latestVideoIds = youTubeService.getChannelVideos(channelId, 20);

        int addedCount = 0;
        for (String videoId : latestVideoIds) {
            // Check if already exists in GLOBAL scope (or collection scope? usually global
            // uniqueness by youtubeId is better)
            // But here we check if it exists in DB at all first.
            // Requirement: "Add to this collection".

            // Logic: If video exists in THIS collection, skip.
            // If video exists in DB but not this collection -> Add to collection (create
            // new Video entity linked to collection? Video is ManyToOne Collection... so
            // duplication implies new entity)
            // Current Schema: Video has ONE Collection. So same Youtube Video in 2
            // collections = 2 Video Rows.

            // Check if this specific video ID exists in this collection
            boolean comments = videoRepository.findByCollectionId(collectionId, PageRequest.of(0, 10000))
                    .getContent().stream()
                    .anyMatch(v -> v.getYoutubeVideoId().equals(videoId));

            if (comments)
                continue;

            // Add new
            try {
                VideoDto.CreateRequest request = new VideoDto.CreateRequest();
                request.setYoutubeUrl(videoId);
                request.setCategory(VideoCategory.ETC); // Default, will be auto-categorized
                request.setComment("Synced from Channel");

                createVideo(collectionId, request);
                addedCount++;
            } catch (Exception e) {
                System.err.println("Failed to sync video " + videoId + ": " + e.getMessage());
            }
        }
        return addedCount;
    }

    @Transactional
    public int importChannelVideos(Long collectionId, String channelUrl, VideoCategory defaultCategory) {
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Collection not found with id: " + collectionId));

        String channelId = youTubeService.extractChannelId(channelUrl);
        List<String> latestVideoIds = youTubeService.getChannelVideos(channelId, 50); // Fetch up to 50 videos

        int addedCount = 0;
        for (String videoId : latestVideoIds) {
            // Check if this video already exists in this collection
            boolean exists = videoRepository.findByCollectionId(collectionId, PageRequest.of(0, 10000))
                    .getContent().stream()
                    .anyMatch(v -> v.getYoutubeVideoId().equals(videoId));

            if (exists)
                continue;

            try {
                VideoDto.CreateRequest request = new VideoDto.CreateRequest();
                request.setYoutubeUrl(videoId);
                request.setCategory(defaultCategory != null ? defaultCategory : VideoCategory.ETC);
                request.setComment("Imported from channel");

                createVideo(collectionId, request);
                addedCount++;
            } catch (Exception e) {
                System.err.println("Failed to import video " + videoId + ": " + e.getMessage());
            }
        }
        return addedCount;
    }

    @Transactional
    public int importPlaylistVideos(Long collectionId, String playlistUrl, VideoCategory defaultCategory) {
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Collection not found with id: " + collectionId));

        String playlistId = youTubeService.extractPlaylistId(playlistUrl);
        List<String> videoIds = youTubeService.getPlaylistVideos(playlistId, 50); // Fetch up to 50 videos

        int addedCount = 0;
        for (String videoId : videoIds) {
            // Check if this video already exists in this collection
            boolean exists = videoRepository.findByCollectionId(collectionId, PageRequest.of(0, 10000))
                    .getContent().stream()
                    .anyMatch(v -> v.getYoutubeVideoId().equals(videoId));

            if (exists)
                continue;

            try {
                VideoDto.CreateRequest request = new VideoDto.CreateRequest();
                request.setYoutubeUrl(videoId);
                request.setCategory(defaultCategory != null ? defaultCategory : VideoCategory.ETC);
                request.setComment("Imported from playlist");

                createVideo(collectionId, request);
                addedCount++;
            } catch (Exception e) {
                System.err.println("Failed to import video " + videoId + ": " + e.getMessage());
            }
        }
        return addedCount;
    }
}
