package com.jewelcca.controller;

import com.jewelcca.dto.OrderRequest;
import com.jewelcca.entity.Order;
import com.jewelcca.entity.User;
import com.jewelcca.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> createOrder(
            @Valid @RequestBody OrderRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Order order = orderService.createOrder(user.getId(), request);
        return ResponseEntity.ok(order);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getUserOrders(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Order> orders = orderService.getUserOrders(user.getId());
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(
            @PathVariable Long id,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Order order = orderService.getOrderById(id);
        
        // Check if user owns this order or is admin
        if (!order.getUser().getId().equals(user.getId()) && !user.getRole().equals(User.Role.ADMIN)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        return ResponseEntity.ok(order);
    }

    @GetMapping("/order-number/{orderNumber}")
    public ResponseEntity<Order> getOrderByOrderNumber(
            @PathVariable String orderNumber,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Order order = orderService.getOrderByOrderNumber(orderNumber);
        
        // Check if user owns this order or is admin
        if (!order.getUser().getId().equals(user.getId()) && !user.getRole().equals(User.Role.ADMIN)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");
        Order order = orderService.updateOrderStatus(id, Order.OrderStatus.valueOf(status));
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{id}/tracking")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> updateTrackingNumber(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String trackingNumber = request.get("trackingNumber");
        Order order = orderService.updateTrackingNumber(id, trackingNumber);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<Order>> getAllOrders(Pageable pageable) {
        Page<Order> orders = orderService.getAllOrders(pageable);
        return ResponseEntity.ok(orders);
    }
}