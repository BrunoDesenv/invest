import api from './axios';

export function createDividendo(data) {
  return api.post('/dividends', data).then(res => res.data);
}

export function listDividendos(usuario, paymentDate) {
  const params = { userId: usuario };
  if (paymentDate) {
    params.paymentDate = paymentDate;
  }
  return api.get('/dividends', { params }).then(res => res.data);
}

export function listDividendosByDataPagamento(usuario, dataPagamento) {
  return api
    .get('/dividendos', { params: { usuario, dataPagamento } })
    .then(res => res.data);
}

export function updateDividendo(id, data) {
  return api.put(`/dividends/${id}`, data).then(res => res.data);
}

export function deleteDividendo(id) {
  return api.delete(`/dividends/${id}`);
}
