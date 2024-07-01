import axios from 'axios';
import generalInterceptor from './general';

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_AXIOS_PREFIX_MANAGE_NEW as string,
  timeout: 50000,
});

generalInterceptor(instance);

export default instance;
