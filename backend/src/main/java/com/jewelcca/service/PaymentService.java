package com.jewelcca.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {

    @Value("${payment.razorpay.key-id}")
    private String razorpayKeyId;

    @Value("${payment.razorpay.key-secret}")
    private String razorpayKeySecret;

    @Value("${payment.razorpay.webhook-secret}")
    private String webhookSecret;

    public Map<String, Object> createRazorpayOrder(String orderId, BigDecimal amount, String currency) throws RazorpayException {
        RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount.multiply(BigDecimal.valueOf(100)).intValue()); // Amount in paise
        orderRequest.put("currency", currency);
        orderRequest.put("receipt", orderId);

        Order order = razorpayClient.orders.create(orderRequest);

        Map<String, Object> response = new HashMap<>();
        response.put("razorpayOrderId", order.get("id"));
        response.put("amount", order.get("amount"));
        response.put("currency", order.get("currency"));
        response.put("keyId", razorpayKeyId);
        
        return response;
    }

    public boolean verifyPaymentSignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", razorpayOrderId);
            options.put("razorpay_payment_id", razorpayPaymentId);
            options.put("razorpay_signature", razorpaySignature);

            return Utils.verifyPaymentSignature(options, razorpayKeySecret);
        } catch (RazorpayException e) {
            return false;
        }
    }

    public boolean verifyWebhookSignature(String payload, String signature) {
        try {
            return Utils.verifyWebhookSignature(payload, signature, webhookSecret);
        } catch (RazorpayException e) {
            return false;
        }
    }
}