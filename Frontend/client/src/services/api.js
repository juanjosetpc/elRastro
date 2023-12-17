import axios from 'axios';

//Esto lo que hace es crear una peticón base que se puede reutilizar en cualquier parte del código
//luego lo que hay que hacer es especificar en dicha parte del codigo lo que se quiere hacer. 
//Por ejemplo api.get('/productos') para obtener todos los usuarios
import { handle401Error } from '../helpers/interceptNotLogged';

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL+"/api/v1",
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem("token")}`,
  },
});


// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Manejar el error 401
//       handle401Error();
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
