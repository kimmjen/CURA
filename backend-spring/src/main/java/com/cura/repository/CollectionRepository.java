package com.cura.repository;

import com.cura.model.Collection;
import com.cura.model.CollectionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollectionRepository extends JpaRepository<Collection, Long> {
        List<Collection> findByTitleContainingIgnoreCase(String title);

        List<Collection> findByType(CollectionType type);

        @Query("SELECT c FROM Collection c ORDER BY c.createdAt DESC")
        Page<Collection> findAllOrderByCreatedAtDesc(Pageable pageable);

        @Query("SELECT c FROM Collection c WHERE c.userId = :userId ORDER BY c.createdAt DESC")
        Page<Collection> findByUserIdOrderByCreatedAtDesc(
                        @org.springframework.data.repository.query.Param("userId") java.util.UUID userId,
                        Pageable pageable);

        @org.springframework.data.jpa.repository.Modifying(clearAutomatically = true)
        @Query("UPDATE Collection c SET c.userId = :userId WHERE c.userId IS NULL")
        int updateUserIdForOrphanCollections(
                        @org.springframework.data.repository.query.Param("userId") java.util.UUID userId);
}
