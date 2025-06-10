// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Intercepta para colocar o token JWT se existir
api.interceptors.request.use(config => {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  if (usuarioLogado?.token) {
    config.headers.Authorization = `Bearer ${usuarioLogado.token}`;
  }
  return config;
});

export default api;
