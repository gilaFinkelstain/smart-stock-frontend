import api from '../lib/api';
import type { LoginRequest, LoginResponse, CreateUserRequest, User } from '../types/models';

export const login = (data: LoginRequest): Promise<LoginResponse> =>
  api.post('/users/login', data).then((r) => r.data);

export const createUser = (data: CreateUserRequest): Promise<{ id: number }> =>
  api.post('/users', data).then((r) => r.data);

export const getUserById = (id: number): Promise<User> =>
  api.get(`/users/${id}`).then((r) => r.data);
