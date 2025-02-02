import axios from 'axios';
//const BASE_URL = 'http://localhost:3500';
const BASE_URL = 'https://userformapi.onrender.com';

export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'content-Type': 'application/json' },
  withCredentials: true,
});
