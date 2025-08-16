import { get, post } from './http';
import type { AddItemRequest, CartView } from './types';

export function getCart(userId: number) {
  return get<CartView>(`/cart/${userId}`);
}

export function addItem(userId: number, data: AddItemRequest) {
  return post<CartView, AddItemRequest>(`/cart/${userId}/add`, data);
}

export function removeItem(userId: number, menuItemId: number) {
  return post<CartView>(`/cart/${userId}/remove/${menuItemId}`, {});
}


