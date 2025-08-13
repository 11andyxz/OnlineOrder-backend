package com.example.order.service;

import com.example.common.dto.OrderDtos;
import com.example.order.domain.Order;
import com.example.order.repo.OrderRepository;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.scheduling.annotation.Async;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

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

        Long orderId = order.getId();
        if (TransactionSynchronizationManager.isActualTransactionActive()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    publishOrderStatusAsync(orderId, "PAID");
                }
            });
        } else {
            publishOrderStatusAsync(orderId, "PAID");
        }
        return order;
    }

    @Async("appTaskExecutor")
    public void publishOrderStatusAsync(Long orderId, String status) {  
        kafkaTemplate.send(new ProducerRecord<>("order-status", orderId.toString(), orderId + ":" + status));
    }
}

