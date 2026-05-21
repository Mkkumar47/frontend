import api from './api';

export const bookingService = {
  create: (data) => api.post('/bookings', data).then(r => r.data),
  myBookings: () => api.get('/bookings/me').then(r => r.data),
  get: (id) => api.get(`/bookings/${id}`).then(r => r.data),
  cancel: (id, reason) => api.patch(`/bookings/${id}/cancel`, { reason }).then(r => r.data),
  computePrice: (data) => api.post('/bookings/price', data).then(r => r.data)
};
