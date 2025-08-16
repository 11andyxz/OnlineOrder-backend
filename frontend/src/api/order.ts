import { post } from './http';
import type { CreateOrderRequest, OrderView } from './types';

export function createOrder(userId: number, data: CreateOrderRequest) {
  return post<OrderView, CreateOrderRequest>(`/orders/create/${userId}`, data);
}


