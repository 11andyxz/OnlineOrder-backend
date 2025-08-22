package com.example.order.web;

import com.example.common.api.ApiResponse;
import com.example.common.dto.OrderDtos;
import com.example.order.domain.Order;
import com.example.order.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/create/{userId}")
    public ResponseEntity<?> create(@PathVariable("userId") Long userId, @RequestBody OrderDtos.CreateOrderRequest request) {
        Order order = orderService.createOrder(userId, request);
        return ResponseEntity.ok(ApiResponse.ok(order));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> detail(@PathVariable("orderId") Long orderId) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getOrderDetail(orderId)));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> listByUser(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.listUserOrders(userId)));
    }
}

