package com.example.cart.web;

import com.example.common.api.ApiResponse;
import com.example.common.dto.CartDtos;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final RedisTemplate<String, Object> redisTemplate;

    public CartController(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    private String key(Long userId) { return "cart:" + userId; }

    @PostMapping("/{userId}/add")
    public ResponseEntity<?> add(@PathVariable("userId") Long userId, @RequestBody CartDtos.AddItemRequest request) {
        List<CartDtos.CartItem> items = getItems(userId);
        CartDtos.CartItem found = items.stream()
                .filter(i -> i.getMenuItemId().equals(request.getMenuItemId()))
                .findFirst().orElse(null);
        if (found == null) {
            found = new CartDtos.CartItem();
            found.setMenuItemId(request.getMenuItemId());
            found.setName("Item " + request.getMenuItemId());
            found.setPrice(new BigDecimal("10.00"));
            found.setQuantity(request.getQuantity());
            items.add(found);
        } else {
            found.setQuantity(found.getQuantity() + request.getQuantity());
        }
        redisTemplate.opsForValue().set(key(userId), items);
        return ResponseEntity.ok(ApiResponse.ok(view(items)));
    }

    @PostMapping("/{userId}/remove/{menuItemId}")
    public ResponseEntity<?> remove(@PathVariable("userId") Long userId, @PathVariable("menuItemId") Long menuItemId) {
        List<CartDtos.CartItem> items = getItems(userId);
        items.removeIf(i -> i.getMenuItemId().equals(menuItemId));
        redisTemplate.opsForValue().set(key(userId), items);
        return ResponseEntity.ok(ApiResponse.ok(view(items)));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> get(@PathVariable("userId") Long userId) {
        List<CartDtos.CartItem> items = getItems(userId);
        return ResponseEntity.ok(ApiResponse.ok(view(items)));
    }

    @SuppressWarnings("unchecked")
    private List<CartDtos.CartItem> getItems(Long userId) {
        Object obj = redisTemplate.opsForValue().get(key(userId));
        if (obj instanceof List<?> list) {
            return (List<CartDtos.CartItem>) list;
        }
        return new ArrayList<>();
    }

    private CartDtos.CartView view(List<CartDtos.CartItem> items) {
        CartDtos.CartView view = new CartDtos.CartView();
        view.setItems(items);
        BigDecimal total = items.stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        view.setTotal(total);
        return view;
    }
}

