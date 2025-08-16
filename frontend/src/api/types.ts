export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface MenuItemView {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
}

export interface UpsertMenuItemRequest {
  name: string;
  description: string;
  price: number;
  available: boolean;
}

export interface CartItem {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface AddItemRequest {
  menuItemId: number;
  quantity: number;
}

export interface CartView {
  items: CartItem[];
  total: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserView {
  id: number;
  email: string;
  name: string;
  token: string;
}

export interface CreateOrderRequest {
  items: { menuItemId: number; quantity: number }[];
  paymentMethod: string;
}

export type OrderStatus = 'CREATED' | 'PAID' | 'CANCELLED';

export interface OrderView {
  id: number;
  userId: number;
  items: { menuItemId: number; quantity: number }[];
  amount: number;
  status: OrderStatus;
}


