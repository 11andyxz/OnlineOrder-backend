import { get, post, put } from './http';
import type { MenuItemView, UpsertMenuItemRequest } from './types';

export function listMenu() {
  return get<MenuItemView[]>('/menu');
}

export function createMenuItem(data: UpsertMenuItemRequest) {
  return post<MenuItemView, UpsertMenuItemRequest>('/menu', data);
}

export function updateMenuItem(id: number, data: UpsertMenuItemRequest) {
  return put<MenuItemView, UpsertMenuItemRequest>(`/menu/${id}`, data);
}


