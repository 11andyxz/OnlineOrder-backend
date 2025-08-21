package com.example.user.service;

import com.example.common.dto.UserDtos;
import com.example.user.domain.User;
import com.example.user.domain.UserType;
import com.example.user.repo.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(); // sercure password hashing
    private final JwtService jwtService;

    public UserService(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @Transactional //ensure database consistency
    public User register(UserDtos.RegisterRequest request) {
        // Check if user already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("User with this email already exists");
        }
        
        // Validate email format
        if (!isValidEmail(request.getEmail())) {
            throw new IllegalArgumentException("Invalid email format");
        }
        
        // Validate password strength
        if (request.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters");
        }
        
        User user = new User();
        user.setEmail(request.getEmail().toLowerCase()); // Normalize email
        user.setName(request.getName());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        
        // Determine user type based on email domain
        UserType userType = determineUserType(request.getEmail());
        user.setUserType(userType);
        
        return userRepository.save(user);
    }

    private boolean isValidEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }
    /*
    Email validation rules:
    - Must contain exactly one @ symbol
    - Must have valid domain with at least one dot
    - Domain must end with at least 2 letters (.com, .org, etc.)
    */

    private UserType determineUserType(String email) {
        if (email != null && email.toLowerCase().endsWith("@siliconinc.com")) {
            return UserType.SUPER_ADMIN;
        }
        return UserType.REGULAR_USER;
    }

    /**
     * Check if a user is a super admin
     * @param userId the user ID to check
     * @return true if the user is a super admin, false otherwise
     */
    public boolean isSuperAdmin(Long userId) {
        return userRepository.findById(userId)
                .map(user -> user.getUserType() == UserType.SUPER_ADMIN)
                .orElse(false);
    }

    /**
     * Check if a user is a super admin by email
     * @param email the user email to check
     * @return true if the user is a super admin, false otherwise
     */
    public boolean isSuperAdmin(String email) {
        return userRepository.findByEmail(email)
                .map(user -> user.getUserType() == UserType.SUPER_ADMIN)
                .orElse(false);
    }

    @Transactional
    public UserDtos.UserView login(UserDtos.LoginRequest request) { //service uses them to authenticate(find by email and check password)
        User user = userRepository.findByEmail(request.getEmail())
                .filter(u -> passwordEncoder.matches(request.getPassword(), u.getPasswordHash()))
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        UserDtos.UserView view = new UserDtos.UserView();
        view.setId(user.getId());
        view.setEmail(user.getEmail());
        view.setName(user.getName());
        view.setUserType(user.getUserType().name());
        view.setToken(jwtService.generateToken(user.getId(), user.getEmail()));
        return view;
    }

    @Transactional
    public void deleteAccount(UserDtos.DeleteAccountRequest request) { //delete account transaction
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail()) //email check
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) { //password check
            throw new IllegalArgumentException("Invalid password");
        }
        
        // Delete the user from database
        userRepository.deleteById(user.getId());
    }

    @Transactional
    public void changePassword(UserDtos.ChangePasswordRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        
        // Validate new password
        if (request.getNewPassword().length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters");
        }
        
        // Check if new password and confirm password match
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new IllegalArgumentException("New password and confirm password do not match");
        }
        
        // Check if new password is different from current password
        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("New password must be different from current password");
        }
        
        // Update password
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    /**
     * Get user profile information
     * @param email the user's email
     * @return ProfileView containing user information
     */
    public UserDtos.ProfileView getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        UserDtos.ProfileView profile = new UserDtos.ProfileView();
        profile.setId(user.getId());
        profile.setEmail(user.getEmail());
        profile.setName(user.getName());
        profile.setUserType(user.getUserType().name());
        
        // Format dates for better readability
        if (user.getCreatedAt() != null) {
            profile.setCreatedAt(user.getCreatedAt().toString());
        }
        if (user.getLastLogin() != null) {
            profile.setLastLogin(user.getLastLogin().toString());
        }
        
        return profile;
    }
}

