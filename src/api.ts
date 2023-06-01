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

export default axios.create({
  headers: { "x-access-token": localStorage.getItem("token") },
  baseURL: "https://thesis-backend-one.vercel.app/",
});
