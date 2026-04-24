package com.cura.repository;

import com.cura.model.Video;
import com.cura.model.VideoCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {
    Page<Video> findByCollectionId(Long collectionId, Pageable pageable);

    Optional<Video> findByYoutubeVideoId(String youtubeVideoId);

    Long countByCollectionId(Long collectionId);

    @Query("SELECT v FROM Video v WHERE LOWER(v.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(v.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Video> searchVideos(@Param("query") String query);

    List<Video> findByCategory(VideoCategory category);

    @Query("SELECT v FROM Video v ORDER BY v.publishedAt DESC")
    List<Video> findRecentVideos(Pageable pageable);

    // 가장 많이 시청된 영상 (인기 영상)
    @Query("""
                SELECT v FROM Video v
                LEFT JOIN WatchHistory wh ON wh.video.id = v.id
                GROUP BY v
                ORDER BY COUNT(wh) DESC, v.publishedAt DESC
            """)
    List<Video> findTrendingVideos(Pageable pageable);
}
