import { get, post } from './http';
import type { RegisterRequest, LoginRequest, UserView, ProfileView, ChangePasswordRequest } from './types';

export function register(data: RegisterRequest) {
  return post<UserView, RegisterRequest>('/users/register', data);
}

export function login(data: LoginRequest) {
  return post<UserView, LoginRequest>('/users/login', data);
}

export function getProfile(email: string) {
  return get<ProfileView>(`/users/profile`, { params: { email } });
}

export function changePassword(data: ChangePasswordRequest) {
  return post<string, ChangePasswordRequest>('/users/change-password', data);
}


