package com.example.common.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

public class CartDtos {
    @Data
    public static class CartItem {
        private Long menuItemId;
        private String name;
        private BigDecimal price;
        private int quantity;
    }

    @Data
    public static class AddItemRequest {
        private Long menuItemId;
        private int quantity;
    }

    @Data
    public static class CartView {
        private List<CartItem> items;
        private BigDecimal total;
    }
}

