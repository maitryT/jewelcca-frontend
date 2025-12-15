package com.jewelcca.controller;

import com.jewelcca.entity.Review;
import com.jewelcca.entity.User;
import com.jewelcca.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<Page<Review>> getProductReviews(
            @PathVariable Long productId,
            Pageable pageable) {
        Page<Review> reviews = reviewService.getProductReviews(productId, pageable);
        return ResponseEntity.ok(reviews);
    }

    @PostMapping("/product/{productId}")
    public ResponseEntity<Review> addReview(
            @PathVariable Long productId,
            @RequestBody Review review,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Review createdReview = reviewService.addReview(productId, user.getId(), review.getRating(), review.getComment());
        return ResponseEntity.ok(createdReview);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(
            @PathVariable Long id,
            @RequestBody Review review,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Review updatedReview = reviewService.updateReview(id, user.getId(), review.getRating(), review.getComment());
        return ResponseEntity.ok(updatedReview);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(
            @PathVariable Long id,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        reviewService.deleteReview(id, user.getId());
        return ResponseEntity.ok().build();
    }
}