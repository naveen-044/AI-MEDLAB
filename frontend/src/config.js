const configuredApiUrl =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const BASE_URL = configuredApiUrl.replace(/\/+$/, "");
export const token = localStorage.getItem("token");
