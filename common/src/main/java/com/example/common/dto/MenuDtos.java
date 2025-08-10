package com.example.common.dto;

import lombok.Data;
import java.math.BigDecimal;

public class MenuDtos {
    @Data
    public static class MenuItemView {
        private Long id;
        private String name;
        private String description;
        private BigDecimal price;
        private boolean available;
    }

    @Data
    public static class UpsertMenuItemRequest {
        private String name;
        private String description;
        private BigDecimal price;
        private boolean available;
    }
}

