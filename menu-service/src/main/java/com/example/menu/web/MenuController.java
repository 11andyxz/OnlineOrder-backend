package com.example.menu.web;

import com.example.common.api.ApiResponse;
import com.example.common.dto.MenuDtos;
import com.example.menu.domain.MenuItem;
import com.example.menu.repo.MenuRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuController {
    private final MenuRepository menuRepository;

    public MenuController(MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }

    @GetMapping
    @Cacheable("menu:list")
    public ResponseEntity<?> list() {
        List<MenuItem> items = menuRepository.findAll();
        return ResponseEntity.ok(ApiResponse.ok(items));
        }

    @PostMapping
    @CacheEvict(value = "menu:list", allEntries = true)
    public ResponseEntity<?> create(@RequestBody MenuDtos.UpsertMenuItemRequest request) {
        MenuItem item = new MenuItem();
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setAvailable(request.isAvailable());
        return ResponseEntity.ok(ApiResponse.ok(menuRepository.save(item)));
    }

    @PutMapping("/{id}")
    @CacheEvict(value = "menu:list", allEntries = true)
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody MenuDtos.UpsertMenuItemRequest request) {
        MenuItem item = menuRepository.findById(id).orElseThrow();
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setAvailable(request.isAvailable());
        return ResponseEntity.ok(ApiResponse.ok(menuRepository.save(item)));
    }
}

