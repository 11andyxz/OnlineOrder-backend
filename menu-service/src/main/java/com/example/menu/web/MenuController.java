package com.example.menu.web;

import com.example.common.api.ApiResponse;
import com.example.common.dto.MenuDtos;
import com.example.menu.domain.MenuItem;
import com.example.menu.repo.MenuRepository;
import com.example.menu.service.MenuService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import org.springframework.beans.factory.annotation.Qualifier;

@RestController
@RequestMapping("/api/menu")
public class MenuController {
    private final MenuRepository menuRepository;
    private final MenuService menuService;
    private final Executor appTaskExecutor;

    public MenuController(MenuRepository menuRepository, MenuService menuService, @Qualifier("appTaskExecutor") Executor appTaskExecutor) {
        this.menuRepository = menuRepository;
        this.menuService = menuService;
        this.appTaskExecutor = appTaskExecutor;
    }

    @GetMapping
    public CompletableFuture<ResponseEntity<?>> list() {
        return CompletableFuture.supplyAsync(() -> ResponseEntity.ok(ApiResponse.ok(menuService.listMenuItems())), appTaskExecutor);
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

