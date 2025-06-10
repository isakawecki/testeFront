// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // ajuste se usar porta ou domínio diferente
});

export default api;
