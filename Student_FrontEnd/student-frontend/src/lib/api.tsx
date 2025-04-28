import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7127/api',
});

export default api;
