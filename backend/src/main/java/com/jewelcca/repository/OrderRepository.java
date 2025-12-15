package com.jewelcca.repository;

import com.jewelcca.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByUserId(Long userId, Pageable pageable);
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // Admin queries
    List<Order> findByStatus(Order.OrderStatus status);
    long countByStatus(Order.OrderStatus status);
    List<Order> findByCreatedAtAfter(LocalDateTime date);
    List<Order> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<Order> findByCreatedAtAfterAndStatus(LocalDateTime date, Order.OrderStatus status);
    Page<Order> findByOrderNumberContainingIgnoreCase(String keyword, Pageable pageable);
    
    @Query("SELECT o.user.id, COUNT(o) FROM Order o GROUP BY o.user.id")
    List<Object[]> findCustomerOrderCounts();
}