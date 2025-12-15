package com.jewelcca.controller;

import com.jewelcca.dto.ChangePasswordRequest;
import com.jewelcca.dto.UserUpdateRequest;
import com.jewelcca.entity.User;
import com.jewelcca.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        User userProfile = userService.getUserById(user.getId());
        return ResponseEntity.ok(userProfile);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateUserProfile(
            @RequestBody UserUpdateRequest userUpdateRequest,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        User updatedUser = userService.updateUser(user.getId(), userUpdateRequest);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/profile/change-password")
    public ResponseEntity<Void> changePassword(
            @RequestBody ChangePasswordRequest changePasswordRequest,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        userService.changePassword(user.getId(), changePasswordRequest);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<User>> getAllUsers(Pageable pageable) {
        Page<User> users = userService.getAllUsers(pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody UserUpdateRequest userUpdateRequest) {
        User updatedUser = userService.updateUser(id, userUpdateRequest);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
}