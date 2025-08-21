package com.example.user.web;

import com.example.common.api.ApiResponse;
import com.example.common.dto.UserDtos;
import com.example.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import org.springframework.beans.factory.annotation.Qualifier;

@RestController
@RequestMapping("/api/users")
public class UserController { // register(email + password) through new user
    private final UserService userService;
    private final Executor appTaskExecutor;

    public UserController(UserService userService, @Qualifier("appTaskExecutor") Executor appTaskExecutor) {
        this.userService = userService;
        this.appTaskExecutor = appTaskExecutor;
    }

    @PostMapping("/register") //read credentials from the JSON request
    public CompletableFuture<ResponseEntity<?>> register(@Valid @RequestBody UserDtos.RegisterRequest request) {
        return CompletableFuture.supplyAsync(() -> ResponseEntity.ok(ApiResponse.ok(userService.register(request))), appTaskExecutor);
    }

    @PostMapping("/login")
    public CompletableFuture<ResponseEntity<?>> login(@Valid @RequestBody UserDtos.LoginRequest request) {
        return CompletableFuture.supplyAsync(() -> ResponseEntity.ok(ApiResponse.ok(userService.login(request))), appTaskExecutor);
    }

    @DeleteMapping("/delete") //delete account through user email and password
    public CompletableFuture<ResponseEntity<?>> deleteAccount(@Valid @RequestBody UserDtos.DeleteAccountRequest request) {
        return CompletableFuture.supplyAsync(() -> {
            userService.deleteAccount(request);
            return ResponseEntity.ok(ApiResponse.ok("Account deleted successfully"));
        }, appTaskExecutor);
    }

    @PostMapping("/change-password") //change password with current password verification
    public CompletableFuture<ResponseEntity<?>> changePassword(@Valid @RequestBody UserDtos.ChangePasswordRequest request) {
        return CompletableFuture.supplyAsync(() -> {
            userService.changePassword(request);
            return ResponseEntity.ok(ApiResponse.ok("Password changed successfully"));
        }, appTaskExecutor);
    }

    @GetMapping("/profile") //get user profile information
    public CompletableFuture<ResponseEntity<?>> getProfile(@RequestParam("email") String email) {
        return CompletableFuture.supplyAsync(() -> {
            UserDtos.ProfileView profile = userService.getProfile(email);
            return ResponseEntity.ok(ApiResponse.ok(profile));
        }, appTaskExecutor);
    }
}

