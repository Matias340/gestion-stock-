import axios from 'axios';

const APIUSERS = axios.create({ baseURL: import.meta.env.VITE_API_USERS_URL });

export const registro = (datos) => APIUSERS.post('/registro', datos);
export const login = (datos) => APIUSERS.post('/login', datos);