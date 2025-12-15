package com.jewelcca.controller;

import com.jewelcca.entity.Order;
import com.jewelcca.entity.User;
import com.jewelcca.service.OrderService;
import com.jewelcca.service.PaymentService;
import com.razorpay.RazorpayException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private OrderService orderService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createPaymentOrder(
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Long orderId = Long.valueOf(request.get("orderId").toString());
            
            Order order = orderService.getOrderById(orderId);
            
            // Verify user owns this order
            if (!order.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Unauthorized"));
            }

            Map<String, Object> paymentOrder = paymentService.createRazorpayOrder(
                order.getOrderNumber(),
                order.getTotalAmount(),
                "INR"
            );

            return ResponseEntity.ok(paymentOrder);
        } catch (RazorpayException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to create payment order"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> request) {
        try {
            String razorpayOrderId = request.get("razorpay_order_id");
            String razorpayPaymentId = request.get("razorpay_payment_id");
            String razorpaySignature = request.get("razorpay_signature");
            String orderNumber = request.get("order_number");

            boolean isValid = paymentService.verifyPaymentSignature(
                razorpayOrderId, razorpayPaymentId, razorpaySignature
            );

            if (isValid) {
                // Update order payment status
                Order order = orderService.getOrderByOrderNumber(orderNumber);
                order.setPaymentStatus(Order.PaymentStatus.COMPLETED);
                order.setStatus(Order.OrderStatus.CONFIRMED);
                orderService.updateOrderStatus(order.getId(), Order.OrderStatus.CONFIRMED);

                return ResponseEntity.ok(Map.of("success", true, "message", "Payment verified successfully"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Payment verification failed"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<?> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("X-Razorpay-Signature") String signature) {
        try {
            boolean isValid = paymentService.verifyWebhookSignature(payload, signature);
            
            if (isValid) {
                // Process webhook payload
                // Update order status based on webhook event
                return ResponseEntity.ok(Map.of("status", "success"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("status", "invalid signature"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", e.getMessage()));
        }
    }
}