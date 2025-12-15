package com.jewelcca.service;

import com.jewelcca.entity.Product;
import com.jewelcca.entity.User;
import com.jewelcca.entity.WishlistItem;
import com.jewelcca.repository.ProductRepository;
import com.jewelcca.repository.UserRepository;
import com.jewelcca.repository.WishlistItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WishlistService {

    @Autowired
    private WishlistItemRepository wishlistItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public List<WishlistItem> getWishlistItems(Long userId) {
        return wishlistItemRepository.findByUserId(userId);
    }

    public WishlistItem addToWishlist(Long userId, Long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (wishlistItemRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new RuntimeException("Product already in wishlist");
        }

        WishlistItem wishlistItem = new WishlistItem(user, product);
        return wishlistItemRepository.save(wishlistItem);
    }

    @Transactional
    public void removeFromWishlist(Long userId, Long productId) {
        wishlistItemRepository.deleteByUserIdAndProductId(userId, productId);
    }

    public boolean isInWishlist(Long userId, Long productId) {
        return wishlistItemRepository.existsByUserIdAndProductId(userId, productId);
    }
}