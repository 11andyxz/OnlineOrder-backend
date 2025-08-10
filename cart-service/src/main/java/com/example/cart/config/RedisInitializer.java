package com.example.cart.config;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

@Component
public class RedisInitializer {
    private final RedisTemplate<String, Object> redisTemplate;

    public RedisInitializer(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @PostConstruct
    public void init() {
       System.out.println("RedisInitializer init....  test for redis -Andy");
    }
    @PreDestroy
    public void destroy() {
        System.out.println("RedisInitializer destroy....  test for redis -Andy");
    }
}
