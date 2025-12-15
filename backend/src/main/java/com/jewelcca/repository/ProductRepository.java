package com.jewelcca.repository;

import com.jewelcca.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.category.slug = :categorySlug")
    Page<Product> findByCategorySlug(@Param("categorySlug") String categorySlug, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.name LIKE %:keyword% OR p.description LIKE %:keyword%")
    Page<Product> findByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :minPrice AND :maxPrice")
    Page<Product> findByPriceRange(@Param("minPrice") BigDecimal minPrice, 
                                   @Param("maxPrice") BigDecimal maxPrice, 
                                   Pageable pageable);
    
    List<Product> findTop8ByOrderByCreatedAtDesc();
    List<Product> findTop8ByOrderByRatingDesc();
    
    // Admin queries
    List<Product> findByStockQuantityLessThan(Integer quantity);
    long countByInStockTrue();
    long countByInStockFalse();
}