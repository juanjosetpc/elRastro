import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v2';

//Esto lo que hace es crear una peticón base que se puede reutilizar en cualquier parte del código
//luego lo que hay que hacer es especificar en dicha parte del codigo lo que se quiere hacer. 
//Por ejemplo api.get('/productos') para obtener todos los usuarios
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Agregar cualquier encabezado adicional que haga falta, como tokens de autenticación, etc.
  },
});

export default api;
