package com.example.user.web;

import com.example.common.api.ApiResponse;
import com.example.common.dto.UserDtos;
import com.example.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserDtos.RegisterRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(userService.register(request)));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody UserDtos.LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(userService.login(request)));
    }
}

