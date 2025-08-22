package com.example.order.service;

import com.example.common.dto.OrderDtos;
import com.example.order.domain.Order;
import com.example.order.repo.OrderRepository;
import com.example.order.repo.OrderItemRepository;
import com.example.order.domain.OrderItem;
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
    private final OrderItemRepository orderItemRepository;

    public OrderService(OrderRepository orderRepository, KafkaTemplate<String, String> kafkaTemplate, OrderItemRepository orderItemRepository) {
        this.orderRepository = orderRepository;
        this.kafkaTemplate = kafkaTemplate;
        this.orderItemRepository = orderItemRepository;
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

        // persist items
        for (OrderDtos.Item it : request.getItems()) {
            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setMenuItemId(it.getMenuItemId());
            oi.setQuantity(it.getQuantity());
            orderItemRepository.save(oi);
        }

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

    @Transactional(readOnly = true)
    public OrderDtos.OrderView getOrderDetail(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        OrderDtos.OrderView view = new OrderDtos.OrderView();
        view.setId(order.getId());
        view.setUserId(order.getUserId());
        view.setAmount(order.getAmount());
        view.setStatus(order.getStatus());
        var items = orderItemRepository.findByOrderId(orderId).stream().map(oi -> {
            OrderDtos.Item it = new OrderDtos.Item();
            it.setMenuItemId(oi.getMenuItemId());
            it.setQuantity(oi.getQuantity());
            return it;
        }).toList();
        view.setItems(items);
        return view;
    }

    @Transactional(readOnly = true)
    public java.util.List<OrderDtos.OrderView> listUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByIdDesc(userId).stream().map(o -> {
            OrderDtos.OrderView v = new OrderDtos.OrderView();
            v.setId(o.getId());
            v.setUserId(o.getUserId());
            v.setAmount(o.getAmount());
            v.setStatus(o.getStatus());
            var items = orderItemRepository.findByOrderId(o.getId()).stream().map(oi -> {
                OrderDtos.Item it = new OrderDtos.Item();
                it.setMenuItemId(oi.getMenuItemId());
                it.setQuantity(oi.getQuantity());
                return it;
            }).toList();
            v.setItems(items);
            return v;
        }).toList();
    }

    @Async("appTaskExecutor")
    public void publishOrderStatusAsync(Long orderId, String status) {  
        kafkaTemplate.send(new ProducerRecord<>("order-status", orderId.toString(), orderId + ":" + status));
    }
}

