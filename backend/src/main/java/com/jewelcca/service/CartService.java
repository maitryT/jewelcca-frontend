package com.jewelcca.service;

import com.jewelcca.entity.CartItem;
import com.jewelcca.entity.Product;
import com.jewelcca.entity.User;
import com.jewelcca.repository.CartItemRepository;
import com.jewelcca.repository.ProductRepository;
import com.jewelcca.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public List<CartItem> getCartItems(Long userId) {
        return cartItemRepository.findByUserId(userId);
    }

    public CartItem addToCart(Long userId, Long productId, Integer quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.isInStock() || product.getStockQuantity() < quantity) {
            throw new RuntimeException("Product is out of stock or insufficient quantity");
        }

        CartItem existingItem = cartItemRepository.findByUserIdAndProductId(userId, productId)
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            existingItem.setUpdatedAt(LocalDateTime.now());
            return cartItemRepository.save(existingItem);
        } else {
            CartItem cartItem = new CartItem(user, product, quantity);
            return cartItemRepository.save(cartItem);
        }
    }

    public CartItem updateCartItem(Long userId, Long productId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findByUserIdAndProductId(userId, productId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
            return null;
        }

        Product product = cartItem.getProduct();
        if (!product.isInStock() || product.getStockQuantity() < quantity) {
            throw new RuntimeException("Product is out of stock or insufficient quantity");
        }

        cartItem.setQuantity(quantity);
        cartItem.setUpdatedAt(LocalDateTime.now());
        return cartItemRepository.save(cartItem);
    }

    @Transactional
    public void removeFromCart(Long userId, Long productId) {
        cartItemRepository.deleteByUserIdAndProductId(userId, productId);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }
}