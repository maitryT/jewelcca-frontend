package com.jewelcca.controller;

import com.jewelcca.entity.User;
import com.jewelcca.entity.WishlistItem;
import com.jewelcca.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<WishlistItem>> getWishlistItems(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<WishlistItem> wishlistItems = wishlistService.getWishlistItems(user.getId());
        return ResponseEntity.ok(wishlistItems);
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<WishlistItem> addToWishlist(
            @PathVariable Long productId,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        WishlistItem wishlistItem = wishlistService.addToWishlist(user.getId(), productId);
        return ResponseEntity.ok(wishlistItem);
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<?> removeFromWishlist(
            @PathVariable Long productId,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        wishlistService.removeFromWishlist(user.getId(), productId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<Map<String, Boolean>> isInWishlist(
            @PathVariable Long productId,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        boolean isInWishlist = wishlistService.isInWishlist(user.getId(), productId);
        return ResponseEntity.ok(Map.of("isInWishlist", isInWishlist));
    }
}