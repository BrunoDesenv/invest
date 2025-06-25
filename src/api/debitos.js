import api from './axios';

export function createDebit(data) {
  return api.post('/debits', data).then(r => r.data);
}

export function listDebits(usuario, dataReferencia) {
  const params = { usuario };
  if (dataReferencia) params.dataReferencia = dataReferencia;
  return api.get('/debits', { params }).then(r => r.data);
}

export function getDebit(id) {
  return api.get(`/debits/${id}`).then(r => r.data);
}

export function updateDebit(id, data) {
  return api.put(`/debits/${id}`, data).then(r => r.data);
}

export function deleteDebit(id) {
  return api.delete(`/debits/${id}`);
}

export function togglePayDebit(id) {
  return api.patch(`/debits/${id}/pay`).then(r => r.data);
}
