import api from './api';

export const roomService = {
  list: (params) => api.get('/rooms', { params }).then(r => r.data),
  get: (id) => api.get(`/rooms/${id}`).then(r => r.data),
  create: (data) => api.post('/rooms', data).then(r => r.data),
  update: (id, data) => api.patch(`/rooms/${id}`, data).then(r => r.data),
  remove: (id) => api.delete(`/rooms/${id}`).then(r => r.data),
  toggleWishlist: (id) => api.post(`/rooms/${id}/wishlist`).then(r => r.data),
  uploadImages: (formData) => api.post('/uploads/images', formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data)
};
