package com.example.user.service;

import com.example.common.dto.UserDtos;
import com.example.user.domain.User;
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
}

