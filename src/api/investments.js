import api from './axios';

export function createInvestment(data) {
  return api.post('/investments', data).then(res => res.data);
}

export function listInvestments(userId) {
  return api.get('/investments', { params: { userId } }).then(res => res.data);
}

export function updateInvestment(id, data) {
  return api.put(`/investments/${id}`, data).then(res => res.data);
}

export function deleteInvestment(id) {
  return api.delete(`/investments/${id}`);
}
