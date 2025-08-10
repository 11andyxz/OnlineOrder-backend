package com.example.common.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

public class OrderDtos {
    public enum OrderStatus { CREATED, PAID, CANCELLED }

    @Data
    public static class CreateOrderRequest {
        private List<Item> items;
        private String paymentMethod;
    }

    @Data
    public static class Item {
        private Long menuItemId;
        private int quantity;
    }

    @Data
    public static class OrderView {
        private Long id;
        private Long userId;
        private List<Item> items;
        private BigDecimal amount;
        private OrderStatus status;
    }
}

