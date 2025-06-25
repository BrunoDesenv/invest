import api from './axios';

export async function register(nome, email, password) {
  const { data } = await api.post('/auth/register', { nome, email, password });
  return data; // { user, token }
}

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  return data; // { user, token }
}

export async function getProfile() {
  const { data } = await api.get('/auth/profile');
  return data;
}
