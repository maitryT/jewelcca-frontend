package com.jewelcca.controller;

import com.jewelcca.entity.Offer;
import com.jewelcca.service.OfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offers")
@CrossOrigin(origins = "*")
public class OfferController {

    @Autowired
    private OfferService offerService;

    @GetMapping
    public ResponseEntity<List<Offer>> getAllOffers() {
        List<Offer> offers = offerService.getAllActiveOffers();
        return ResponseEntity.ok(offers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Offer> getOfferById(@PathVariable Long id) {
        Offer offer = offerService.getOfferById(id);
        return ResponseEntity.ok(offer);
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<Offer> getOfferByCode(@PathVariable String code) {
        Offer offer = offerService.getOfferByCode(code);
        return ResponseEntity.ok(offer);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Offer> createOffer(@RequestBody Offer offer) {
        Offer createdOffer = offerService.createOffer(offer);
        return ResponseEntity.ok(createdOffer);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Offer> updateOffer(@PathVariable Long id, @RequestBody Offer offer) {
        Offer updatedOffer = offerService.updateOffer(id, offer);
        return ResponseEntity.ok(updatedOffer);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteOffer(@PathVariable Long id) {
        offerService.deleteOffer(id);
        return ResponseEntity.ok().build();
    }
}