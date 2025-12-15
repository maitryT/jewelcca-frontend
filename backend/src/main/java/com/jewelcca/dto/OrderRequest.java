package com.jewelcca.dto;

import com.jewelcca.entity.Address;
import com.jewelcca.entity.Order;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public class OrderRequest {
    @NotNull
    private Order.PaymentMethod paymentMethod;

    @Valid
    @NotNull
    private Address shippingAddress;

    // Constructors
    public OrderRequest() {}

    public OrderRequest(Order.PaymentMethod paymentMethod, Address shippingAddress) {
        this.paymentMethod = paymentMethod;
        this.shippingAddress = shippingAddress;
    }

    // Getters and Setters
    public Order.PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(Order.PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public Address getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(Address shippingAddress) { this.shippingAddress = shippingAddress; }
}