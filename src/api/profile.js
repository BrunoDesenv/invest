import api from './axios';

export function getProfile(userId) {
  return api.get(`/profile/${userId}`).then(res => res.data);
}

export function updateProfile(userId, data) {
  return api.put(`/profile/${userId}`, data).then(res => res.data);
}
