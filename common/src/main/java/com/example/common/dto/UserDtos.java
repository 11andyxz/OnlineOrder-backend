package com.example.common.dto;

import lombok.Data;

public class UserDtos { 
    @Data
    public static class RegisterRequest {
        private String email;
        private String password;
        private String name;
    }

    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    public static class UserView {
        private Long id;
        private String email;
        private String name;
        private String userType;
        private String token;
    }

    @Data
    public static class DeleteAccountRequest {
        private String email;
        private String password;
    }

    @Data
    public static class ChangePasswordRequest {
        private String email;
        private String currentPassword;
        private String newPassword;
        private String confirmNewPassword;
    }

    @Data
    public static class ProfileView {
        private Long id;
        private String email;
        private String name;
        private String userType;
        private String createdAt;
        private String lastLogin;
    }
}

