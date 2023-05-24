import axios, { AxiosRequestConfig } from 'axios';

export const apiParams: any = {}

export const authInterceptor = (config: AxiosRequestConfig<any>) => {
  if (config.headers) {
    console.log('setting access token 123124');
    
    config.headers['x-access-token'] = localStorage.getItem('token');
  }
  return config;
}

export default axios.create({
  headers: { 'x-access-token': localStorage.getItem('token') },
});
