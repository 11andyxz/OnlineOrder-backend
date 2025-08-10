package com.example.order.mq;

import com.example.order.domain.Order;
import com.example.order.repo.OrderRepository;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OrderStatusConsumer {
    private final OrderRepository orderRepository;

    public OrderStatusConsumer(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @KafkaListener(topics = "order-status", groupId = "order-service")
    public void handle(ConsumerRecord<String, String> record) {
        try {
            String[] parts = record.value().split(":");
            Long orderId = Long.parseLong(parts[0]);
            String status = parts[1];
            Order order = orderRepository.findById(orderId).orElseThrow();
            order.setStatus(Enum.valueOf(com.example.common.dto.OrderDtos.OrderStatus.class, status));
            orderRepository.save(order);
        } catch (Exception ignored) {}
    }
}

