import { post } from './http';
import type { RegisterRequest, LoginRequest, UserView } from './types';

export function register(data: RegisterRequest) {
  return post<UserView, RegisterRequest>('/users/register', data);
}

export function login(data: LoginRequest) {
  return post<UserView, LoginRequest>('/users/login', data);
}


