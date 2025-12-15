package com.jewelcca.service;

import com.jewelcca.entity.Order;
import com.jewelcca.entity.Product;
import com.jewelcca.entity.User;
import com.jewelcca.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Basic counts
        stats.put("totalUsers", userRepository.count());
        stats.put("totalOrders", orderRepository.count());
        stats.put("totalProducts", productRepository.count());
        stats.put("totalCategories", categoryRepository.count());
        
        // Revenue calculations
        List<Order> completedOrders = orderRepository.findByStatus(Order.OrderStatus.DELIVERED);
        BigDecimal totalRevenue = completedOrders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("totalRevenue", totalRevenue);
        
        // This month's stats
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        List<Order> thisMonthOrders = orderRepository.findByCreatedAtAfter(startOfMonth);
        stats.put("thisMonthOrders", thisMonthOrders.size());
        
        BigDecimal thisMonthRevenue = thisMonthOrders.stream()
                .filter(order -> order.getStatus() == Order.OrderStatus.DELIVERED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("thisMonthRevenue", thisMonthRevenue);
        
        // Growth calculations (compared to last month)
        LocalDateTime lastMonthStart = startOfMonth.minusMonths(1);
        LocalDateTime lastMonthEnd = startOfMonth.minusDays(1);
        List<Order> lastMonthOrders = orderRepository.findByCreatedAtBetween(lastMonthStart, lastMonthEnd);
        
        double orderGrowth = lastMonthOrders.isEmpty() ? 100.0 : 
                ((double)(thisMonthOrders.size() - lastMonthOrders.size()) / lastMonthOrders.size()) * 100;
        stats.put("orderGrowth", Math.round(orderGrowth * 100.0) / 100.0);
        
        // Low stock products
        List<Product> lowStockProducts = productRepository.findByStockQuantityLessThan(10);
        stats.put("lowStockCount", lowStockProducts.size());
        
        // Pending orders
        long pendingOrders = orderRepository.countByStatus(Order.OrderStatus.PENDING);
        stats.put("pendingOrders", pendingOrders);
        
        return stats;
    }

    public List<Map<String, Object>> getSalesChartData(int days) {
        LocalDateTime startDate = LocalDateTime.now().minusDays(days);
        List<Order> orders = orderRepository.findByCreatedAtAfterAndStatus(startDate, Order.OrderStatus.DELIVERED);
        
        Map<String, BigDecimal> dailySales = new LinkedHashMap<>();
        
        // Initialize all days with 0
        for (int i = days - 1; i >= 0; i--) {
            LocalDateTime date = LocalDateTime.now().minusDays(i);
            String dateKey = date.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            dailySales.put(dateKey, BigDecimal.ZERO);
        }
        
        // Aggregate sales by date
        orders.forEach(order -> {
            String dateKey = order.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            dailySales.merge(dateKey, order.getTotalAmount(), BigDecimal::add);
        });
        
        return dailySales.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("date", entry.getKey());
                    data.put("sales", entry.getValue());
                    return data;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getCategorySalesData() {
        List<Order> deliveredOrders = orderRepository.findByStatus(Order.OrderStatus.DELIVERED);
        Map<String, BigDecimal> categorySales = new HashMap<>();
        
        deliveredOrders.forEach(order -> {
            order.getOrderItems().forEach(item -> {
                String categoryName = item.getProduct().getCategory().getName();
                BigDecimal itemTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                categorySales.merge(categoryName, itemTotal, BigDecimal::add);
            });
        });
        
        return categorySales.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("category", entry.getKey());
                    data.put("sales", entry.getValue());
                    return data;
                })
                .sorted((a, b) -> ((BigDecimal)b.get("sales")).compareTo((BigDecimal)a.get("sales")))
                .collect(Collectors.toList());
    }

    public List<Order> getRecentOrders() {
        Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "createdAt"));
        return orderRepository.findAll(pageable).getContent();
    }

    public List<Map<String, Object>> getTopSellingProducts() {
        List<Order> deliveredOrders = orderRepository.findByStatus(Order.OrderStatus.DELIVERED);
        Map<Long, Integer> productSales = new HashMap<>();
        Map<Long, Product> productMap = new HashMap<>();
        
        deliveredOrders.forEach(order -> {
            order.getOrderItems().forEach(item -> {
                Long productId = item.getProduct().getId();
                productSales.merge(productId, item.getQuantity(), Integer::sum);
                productMap.put(productId, item.getProduct());
            });
        });
        
        return productSales.entrySet().stream()
                .sorted(Map.Entry.<Long, Integer>comparingByValue().reversed())
                .limit(10)
                .map(entry -> {
                    Map<String, Object> data = new HashMap<>();
                    Product product = productMap.get(entry.getKey());
                    data.put("productId", entry.getKey());
                    data.put("productName", product.getName());
                    data.put("quantitySold", entry.getValue());
                    data.put("revenue", product.getPrice().multiply(BigDecimal.valueOf(entry.getValue())));
                    return data;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getRevenueChartData(int months) {
        LocalDateTime startDate = LocalDateTime.now().minusMonths(months);
        List<Order> orders = orderRepository.findByCreatedAtAfterAndStatus(startDate, Order.OrderStatus.DELIVERED);
        
        Map<String, BigDecimal> monthlyRevenue = new LinkedHashMap<>();
        
        // Initialize all months with 0
        for (int i = months - 1; i >= 0; i--) {
            LocalDateTime date = LocalDateTime.now().minusMonths(i);
            String monthKey = date.format(DateTimeFormatter.ofPattern("yyyy-MM"));
            monthlyRevenue.put(monthKey, BigDecimal.ZERO);
        }
        
        // Aggregate revenue by month
        orders.forEach(order -> {
            String monthKey = order.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM"));
            monthlyRevenue.merge(monthKey, order.getTotalAmount(), BigDecimal::add);
        });
        
        return monthlyRevenue.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("month", entry.getKey());
                    data.put("revenue", entry.getValue());
                    return data;
                })
                .collect(Collectors.toList());
    }

    // User Management
    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public Page<User> searchUsers(String keyword, Pageable pageable) {
        return userRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                keyword, keyword, keyword, pageable);
    }

    public User updateUserStatus(Long userId, Boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(enabled);
        return userRepository.save(user);
    }

    public User updateUserRole(Long userId, User.Role role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(role);
        return userRepository.save(user);
    }

    // Order Management
    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    public Page<Order> searchOrders(String keyword, Pageable pageable) {
        return orderRepository.findByOrderNumberContainingIgnoreCase(keyword, pageable);
    }

    public Page<Order> filterOrders(String status, String paymentMethod, 
                                   LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        // This would require a custom repository method with Criteria API or @Query
        // For simplicity, returning all orders here
        return orderRepository.findAll(pageable);
    }

    // Product Management
    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    public List<Product> getLowStockProducts() {
        return productRepository.findByStockQuantityLessThan(10);
    }

    public Product updateProductStock(Long productId, Integer stock) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setStockQuantity(stock);
        product.setInStock(stock > 0);
        return productRepository.save(product);
    }

    // Analytics
    public Map<String, Object> getCustomerInsights() {
        Map<String, Object> insights = new HashMap<>();
        
        long totalCustomers = userRepository.countByRole(User.Role.USER);
        insights.put("totalCustomers", totalCustomers);
        
        // New customers this month
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        long newCustomersThisMonth = userRepository.countByRoleAndCreatedAtAfter(User.Role.USER, startOfMonth);
        insights.put("newCustomersThisMonth", newCustomersThisMonth);
        
        // Repeat customers (customers with more than 1 order)
        List<Object[]> customerOrderCounts = orderRepository.findCustomerOrderCounts();
        long repeatCustomers = customerOrderCounts.stream()
                .mapToLong(row -> (Long) row[1])
                .filter(count -> count > 1)
                .count();
        insights.put("repeatCustomers", repeatCustomers);
        
        // Average order value
        List<Order> deliveredOrders = orderRepository.findByStatus(Order.OrderStatus.DELIVERED);
        if (!deliveredOrders.isEmpty()) {
            BigDecimal totalRevenue = deliveredOrders.stream()
                    .map(Order::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal avgOrderValue = totalRevenue.divide(BigDecimal.valueOf(deliveredOrders.size()), 2, BigDecimal.ROUND_HALF_UP);
            insights.put("averageOrderValue", avgOrderValue);
        } else {
            insights.put("averageOrderValue", BigDecimal.ZERO);
        }
        
        return insights;
    }

    public Map<String, Object> getInventoryReport() {
        Map<String, Object> report = new HashMap<>();
        
        long totalProducts = productRepository.count();
        report.put("totalProducts", totalProducts);
        
        long inStockProducts = productRepository.countByInStockTrue();
        report.put("inStockProducts", inStockProducts);
        
        long outOfStockProducts = productRepository.countByInStockFalse();
        report.put("outOfStockProducts", outOfStockProducts);
        
        List<Product> lowStockProducts = productRepository.findByStockQuantityLessThan(10);
        report.put("lowStockProducts", lowStockProducts.size());
        
        // Total inventory value
        List<Product> allProducts = productRepository.findAll();
        BigDecimal totalInventoryValue = allProducts.stream()
                .map(product -> product.getPrice().multiply(BigDecimal.valueOf(product.getStockQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        report.put("totalInventoryValue", totalInventoryValue);
        
        return report;
    }

    public Map<String, Object> getFinancialSummary(LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> summary = new HashMap<>();
        
        if (startDate == null) {
            startDate = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        }
        if (endDate == null) {
            endDate = LocalDateTime.now();
        }
        
        List<Order> ordersInPeriod = orderRepository.findByCreatedAtBetween(startDate, endDate);
        
        BigDecimal totalRevenue = ordersInPeriod.stream()
                .filter(order -> order.getStatus() == Order.OrderStatus.DELIVERED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        summary.put("totalRevenue", totalRevenue);
        
        long totalOrders = ordersInPeriod.size();
        summary.put("totalOrders", totalOrders);
        
        long completedOrders = ordersInPeriod.stream()
                .mapToLong(order -> order.getStatus() == Order.OrderStatus.DELIVERED ? 1 : 0)
                .sum();
        summary.put("completedOrders", completedOrders);
        
        long cancelledOrders = ordersInPeriod.stream()
                .mapToLong(order -> order.getStatus() == Order.OrderStatus.CANCELLED ? 1 : 0)
                .sum();
        summary.put("cancelledOrders", cancelledOrders);
        
        if (totalOrders > 0) {
            double completionRate = ((double) completedOrders / totalOrders) * 100;
            summary.put("completionRate", Math.round(completionRate * 100.0) / 100.0);
        } else {
            summary.put("completionRate", 0.0);
        }
        
        return summary;
    }
}