import axios from 'axios';

import { handle401Error } from '../helpers/interceptNotLogged';

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL + "/api/v2",
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem("token")}`, // Agregar el token al encabezado
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Manejar el error 401
      handle401Error();
    }
    return Promise.reject(error);
  }
);

export default api;
