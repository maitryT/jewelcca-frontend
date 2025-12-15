package com.jewelcca.controller;

import com.jewelcca.dto.CartItemRequest;
import com.jewelcca.entity.CartItem;
import com.jewelcca.entity.User;
import com.jewelcca.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItem>> getCartItems(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<CartItem> cartItems = cartService.getCartItems(user.getId());
        return ResponseEntity.ok(cartItems);
    }

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(
            @Valid @RequestBody CartItemRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        CartItem cartItem = cartService.addToCart(user.getId(), request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(cartItem);
    }

    @PutMapping("/update/{productId}")
    public ResponseEntity<CartItem> updateCartItem(
            @PathVariable Long productId,
            @RequestBody Map<String, Integer> request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Integer quantity = request.get("quantity");
        CartItem cartItem = cartService.updateCartItem(user.getId(), productId, quantity);
        return ResponseEntity.ok(cartItem);
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<?> removeFromCart(
            @PathVariable Long productId,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        cartService.removeFromCart(user.getId(), productId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        cartService.clearCart(user.getId());
        return ResponseEntity.ok().build();
    }
}