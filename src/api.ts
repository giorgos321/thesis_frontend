import type { AxiosRequestConfig } from "axios";
import axios from "axios";

export const apiParams: {
  authInterceptorId: number | null;
} = {
  authInterceptorId: null,
};

export const authInterceptor = (config: AxiosRequestConfig) => {
  if (config.headers) {
    config.headers["x-access-token"] = localStorage.getItem("token");
  }
  return config;
};


const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8080/";

export default axios.create({
  headers: { "x-access-token": localStorage.getItem("token") },
  baseURL: apiUrl,
});
