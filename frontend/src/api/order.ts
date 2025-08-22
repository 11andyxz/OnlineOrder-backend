import { get, post } from './http';
import type { CreateOrderRequest, OrderView } from './types';

export function createOrder(userId: number, data: CreateOrderRequest) {
  return post<OrderView, CreateOrderRequest>(`/orders/create/${userId}`, data);
}

export function getOrder(orderId: number) {
  return get<OrderView>(`/orders/${orderId}`);
}

export function listOrders(userId: number) {
  return get<OrderView[]>(`/orders/user/${userId}`);
}


