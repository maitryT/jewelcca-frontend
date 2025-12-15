package com.jewelcca.service;

import com.jewelcca.entity.Product;
import com.jewelcca.entity.Review;
import com.jewelcca.entity.User;
import com.jewelcca.repository.ProductRepository;
import com.jewelcca.repository.ReviewRepository;
import com.jewelcca.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public Page<Review> getProductReviews(Long productId, Pageable pageable) {
        return reviewRepository.findByProductId(productId, pageable);
    }

    @Transactional
    public Review addReview(Long productId, Long userId, Integer rating, String comment) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (reviewRepository.existsByProductIdAndUserId(productId, userId)) {
            throw new RuntimeException("You have already reviewed this product");
        }

        Review review = new Review(product, user, rating, comment);
        review = reviewRepository.save(review);

        // Update product rating
        updateProductRating(productId);

        return review;
    }

    @Transactional
    public Review updateReview(Long reviewId, Long userId, Integer rating, String comment) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only update your own reviews");
        }

        review.setRating(rating);
        review.setComment(comment);
        review = reviewRepository.save(review);

        // Update product rating
        updateProductRating(review.getProduct().getId());

        return review;
    }

    @Transactional
    public void deleteReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only delete your own reviews");
        }

        Long productId = review.getProduct().getId();
        reviewRepository.delete(review);

        // Update product rating
        updateProductRating(productId);
    }

    private void updateProductRating(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Page<Review> reviews = reviewRepository.findByProductId(productId, Pageable.unpaged());
        
        if (reviews.getTotalElements() > 0) {
            double averageRating = reviews.getContent().stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);
            
            product.setRating(BigDecimal.valueOf(averageRating).setScale(2, RoundingMode.HALF_UP));
            product.setReviewCount((int) reviews.getTotalElements());
        } else {
            product.setRating(BigDecimal.ZERO);
            product.setReviewCount(0);
        }

        productRepository.save(product);
    }
}