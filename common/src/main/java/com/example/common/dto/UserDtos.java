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
        private String token;
    }

    @Data
    public static class DeleteAccountRequest {
        private String email;
        private String password;
    }
}

