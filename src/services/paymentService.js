import api from './api';

export const paymentService = {
  initiate: (bookingId) => api.post('/payments/initiate', { bookingId }).then(r => r.data),
  verify: (mtid) => api.get(`/payments/verify/${mtid}`).then(r => r.data),
  downloadReceipt: (bookingId) => api.get(`/payments/receipt/${bookingId}`, { responseType: 'blob' })
};
