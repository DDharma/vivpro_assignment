import axios from "axios";
import type { ApiErrorBody } from "@/lib/types";

const RAW_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export const API_BASE = `${RAW_BASE.replace(/\/$/, "")}/api/v1`;

const defaultAxios = axios.create({ baseURL: API_BASE });

defaultAxios.interceptors.request.use((config) => {
  config.headers["Content-Type"] = "application/json";
  return config;
});

defaultAxios.interceptors.response.use(
  (res) => res,
  (err) => {
    const status: number = err.response?.status ?? 0;
    const body: ApiErrorBody | null = err.response?.data ?? null;
    let message = `Request failed (${status})`;
    if (body) {
      if (typeof body.detail === "string") message = body.detail;
      else if (Array.isArray(body.detail) && body.detail[0]?.msg) message = body.detail[0].msg;
      else if (body.error) message = body.error;
    } else if (!err.response) {
      message = "Network error — is the backend running?";
    }
    return Promise.reject(message);
  },
);

export default defaultAxios;
