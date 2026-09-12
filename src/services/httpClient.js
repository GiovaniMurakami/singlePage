import axios from "axios";
import { AUTH_STORAGE_KEY } from "../constants/auth";

export function getApiBaseUrl() {
  return import.meta.env.VITE_API_URL || "http://localhost:3000";
}

const httpClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000,
});

function readAuth() {
  try {
    return JSON.parse(window.localStorage.getItem(AUTH_STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

function writeAuth(next) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
}

httpClient.interceptors.request.use((config) => {
  const auth = readAuth();
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

let refreshing = null;

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || original?._retry || original?.url?.includes("/usuario/refresh-token")) {
      return Promise.reject(error);
    }
    const auth = readAuth();
    if (!auth?.refreshToken) return Promise.reject(error);

    original._retry = true;
    if (!refreshing) {
      refreshing = axios
        .post(`${getApiBaseUrl()}/usuario/refresh-token`, { refreshToken: auth.refreshToken })
        .then((res) => {
          writeAuth({ ...auth, token: res.data.token, refreshToken: res.data.refreshToken, usuario: res.data.usuario || auth.usuario });
          return res.data.token;
        })
        .finally(() => {
          refreshing = null;
        });
    }

    try {
      const token = await refreshing;
      original.headers.Authorization = `Bearer ${token}`;
      return httpClient(original);
    } catch (refreshError) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      window.dispatchEvent(new Event("auth:logout"));
      return Promise.reject(refreshError);
    }
  }
);

export default httpClient;
