package com.jewelcca.controller;

import com.jewelcca.entity.Order;
import com.jewelcca.entity.Product;
import com.jewelcca.entity.User;
import com.jewelcca.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/dashboard/sales-chart")
    public ResponseEntity<List<Map<String, Object>>> getSalesChart(
            @RequestParam(defaultValue = "30") int days) {
        List<Map<String, Object>> salesData = adminService.getSalesChartData(days);
        return ResponseEntity.ok(salesData);
    }

    @GetMapping("/dashboard/category-sales")
    public ResponseEntity<List<Map<String, Object>>> getCategorySales() {
        List<Map<String, Object>> categoryData = adminService.getCategorySalesData();
        return ResponseEntity.ok(categoryData);
    }

    @GetMapping("/dashboard/recent-orders")
    public ResponseEntity<List<Order>> getRecentOrders() {
        List<Order> recentOrders = adminService.getRecentOrders();
        return ResponseEntity.ok(recentOrders);
    }

    @GetMapping("/dashboard/top-products")
    public ResponseEntity<List<Map<String, Object>>> getTopProducts() {
        List<Map<String, Object>> topProducts = adminService.getTopSellingProducts();
        return ResponseEntity.ok(topProducts);
    }

    @GetMapping("/dashboard/revenue-chart")
    public ResponseEntity<List<Map<String, Object>>> getRevenueChart(
            @RequestParam(defaultValue = "12") int months) {
        List<Map<String, Object>> revenueData = adminService.getRevenueChartData(months);
        return ResponseEntity.ok(revenueData);
    }

    // User Management
    @GetMapping("/users")
    public ResponseEntity<Page<User>> getAllUsers(Pageable pageable) {
        Page<User> users = adminService.getAllUsers(pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/search")
    public ResponseEntity<Page<User>> searchUsers(
            @RequestParam String keyword, 
            Pageable pageable) {
        Page<User> users = adminService.searchUsers(keyword, pageable);
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<User> updateUserStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> request) {
        Boolean enabled = request.get("enabled");
        User user = adminService.updateUserStatus(id, enabled);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<User> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String role = request.get("role");
        User user = adminService.updateUserRole(id, User.Role.valueOf(role));
        return ResponseEntity.ok(user);
    }

    // Order Management
    @GetMapping("/orders")
    public ResponseEntity<Page<Order>> getAllOrders(Pageable pageable) {
        Page<Order> orders = adminService.getAllOrders(pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/search")
    public ResponseEntity<Page<Order>> searchOrders(
            @RequestParam String keyword,
            Pageable pageable) {
        Page<Order> orders = adminService.searchOrders(keyword, pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/filter")
    public ResponseEntity<Page<Order>> filterOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String paymentMethod,
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate,
            Pageable pageable) {
        Page<Order> orders = adminService.filterOrders(status, paymentMethod, startDate, endDate, pageable);
        return ResponseEntity.ok(orders);
    }

    // Product Management
    @GetMapping("/products")
    public ResponseEntity<Page<Product>> getAllProducts(Pageable pageable) {
        Page<Product> products = adminService.getAllProducts(pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/products/low-stock")
    public ResponseEntity<List<Product>> getLowStockProducts() {
        List<Product> products = adminService.getLowStockProducts();
        return ResponseEntity.ok(products);
    }

    @PutMapping("/products/{id}/stock")
    public ResponseEntity<Product> updateProductStock(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> request) {
        Integer stock = request.get("stock");
        Product product = adminService.updateProductStock(id, stock);
        return ResponseEntity.ok(product);
    }

    // Analytics
    @GetMapping("/analytics/customer-insights")
    public ResponseEntity<Map<String, Object>> getCustomerInsights() {
        Map<String, Object> insights = adminService.getCustomerInsights();
        return ResponseEntity.ok(insights);
    }

    @GetMapping("/analytics/inventory-report")
    public ResponseEntity<Map<String, Object>> getInventoryReport() {
        Map<String, Object> report = adminService.getInventoryReport();
        return ResponseEntity.ok(report);
    }

    @GetMapping("/analytics/financial-summary")
    public ResponseEntity<Map<String, Object>> getFinancialSummary(
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate) {
        Map<String, Object> summary = adminService.getFinancialSummary(startDate, endDate);
        return ResponseEntity.ok(summary);
    }
}