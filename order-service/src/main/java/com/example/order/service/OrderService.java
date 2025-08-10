package com.example.order.service;

import com.example.common.dto.OrderDtos;
import com.example.order.domain.Order;
import com.example.order.repo.OrderRepository;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    public OrderService(OrderRepository orderRepository, KafkaTemplate<String, String> kafkaTemplate) {
        this.orderRepository = orderRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Transactional
    public Order createOrder(Long userId, OrderDtos.CreateOrderRequest request) {
        BigDecimal amount = request.getItems().stream()
                .map(i -> BigDecimal.valueOf(10).multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = new Order();
        order.setUserId(userId);
        order.setAmount(amount);
        order.setStatus(OrderDtos.OrderStatus.CREATED);
        order = orderRepository.save(order);

        kafkaTemplate.send(new ProducerRecord<>("order-status", order.getId().toString(), order.getId() + ":PAID"));
        return order;
    }
}

