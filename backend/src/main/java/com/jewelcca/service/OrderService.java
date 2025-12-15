package com.jewelcca.service;


import com.jewelcca.dto.OrderRequest;
import com.jewelcca.entity.*;
import com.jewelcca.repository.CartItemRepository;
import com.jewelcca.repository.OrderRepository;
import com.jewelcca.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Order createOrder(Long userId, OrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Calculate total amount
        BigDecimal totalAmount = cartItems.stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Create order
        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setUser(user);
        order.setTotalAmount(totalAmount);
        order.setPaymentMethod(request.getPaymentMethod());
        order.setShippingAddress(request.getShippingAddress());

        if (request.getPaymentMethod() == Order.PaymentMethod.COD) {
            order.setPaymentStatus(Order.PaymentStatus.PENDING);
        } else {
            order.setPaymentStatus(Order.PaymentStatus.COMPLETED);
        }

        order = orderRepository.save(order);

        // Create order items
        Order finalOrder = order;
        List<OrderItem> orderItems = cartItems.stream()
                .map(cartItem -> new OrderItem(
                        finalOrder,
                        cartItem.getProduct(),
                        cartItem.getQuantity(),
                        cartItem.getProduct().getPrice()
                ))
                .collect(Collectors.toList());

        order.setOrderItems(orderItems);

        // Clear cart
        cartItemRepository.deleteByUserId(userId);

        return orderRepository.save(order);
    }

    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public Order getOrderByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    public Order updateOrderStatus(Long id, Order.OrderStatus status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());

        if (status == Order.OrderStatus.SHIPPED) {
            order.setEstimatedDelivery(LocalDateTime.now().plusDays(3));
        }

        return orderRepository.save(order);
    }

    public Order updateTrackingNumber(Long id, String trackingNumber) {
        Order order = getOrderById(id);
        order.setTrackingNumber(trackingNumber);
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    private String generateOrderNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "JW-" + timestamp;
    }
}