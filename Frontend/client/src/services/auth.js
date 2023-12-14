import axios from 'axios';

const auth = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL+"/auth",
  headers: {
    'Content-Type': 'application/json',
  },
});

export default auth;