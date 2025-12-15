package com.jewelcca.service;

import com.jewelcca.entity.Offer;
import com.jewelcca.repository.OfferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OfferService {

    @Autowired
    private OfferRepository offerRepository;

    public List<Offer> getAllActiveOffers() {
        return offerRepository.findActiveOffers(LocalDateTime.now());
    }

    public Offer getOfferById(Long id) {
        return offerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offer not found"));
    }

    public Offer getOfferByCode(String code) {
        return offerRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Offer not found"));
    }

    public Offer createOffer(Offer offer) {
        return offerRepository.save(offer);
    }

    public Offer updateOffer(Long id, Offer offerUpdate) {
        Offer offer = getOfferById(id);
        
        if (offerUpdate.getTitle() != null) {
            offer.setTitle(offerUpdate.getTitle());
        }
        if (offerUpdate.getDescription() != null) {
            offer.setDescription(offerUpdate.getDescription());
        }
        if (offerUpdate.getDiscountPercentage() != null) {
            offer.setDiscountPercentage(offerUpdate.getDiscountPercentage());
        }
        if (offerUpdate.getCode() != null) {
            offer.setCode(offerUpdate.getCode());
        }
        if (offerUpdate.getImageUrl() != null) {
            offer.setImageUrl(offerUpdate.getImageUrl());
        }
        if (offerUpdate.getValidFrom() != null) {
            offer.setValidFrom(offerUpdate.getValidFrom());
        }
        if (offerUpdate.getValidTo() != null) {
            offer.setValidTo(offerUpdate.getValidTo());
        }
        
        offer.setActive(offerUpdate.isActive());
        offer.setUpdatedAt(LocalDateTime.now());
        
        return offerRepository.save(offer);
    }

    public void deleteOffer(Long id) {
        Offer offer = getOfferById(id);
        offerRepository.delete(offer);
    }
}