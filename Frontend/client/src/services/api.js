import axios from 'axios';

//Esto lo que hace es crear una peticón base que se puede reutilizar en cualquier parte del código
//luego lo que hay que hacer es especificar en dicha parte del codigo lo que se quiere hacer. 
//Por ejemplo api.get('/productos') para obtener todos los usuarios

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL+"/api/v1"
});


export default api;
