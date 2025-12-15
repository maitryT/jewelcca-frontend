package com.jewelcca.repository;

import com.jewelcca.entity.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {
    List<Offer> findByIsActiveTrue();
    
    @Query("SELECT o FROM Offer o WHERE o.isActive = true AND o.validFrom <= :now AND o.validTo >= :now")
    List<Offer> findActiveOffers(LocalDateTime now);
    
    Optional<Offer> findByCode(String code);
}