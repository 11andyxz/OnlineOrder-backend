package com.example.menu.service;

import com.example.menu.domain.MenuItem;
import com.example.menu.repo.MenuRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuService {
    private final MenuRepository menuRepository;

    public MenuService(MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }

    @Cacheable("menu:list")
    public List<MenuItem> listMenuItems() {
        return menuRepository.findAll();
    }
}


