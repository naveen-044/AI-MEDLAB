const configuredApiUrl =
  import.meta.env.VITE_API_URL || "https://ai-medlab-theta.vercel.app/api/v1";

export const BASE_URL = configuredApiUrl.replace(/\/+$/, "");
export const token = localStorage.getItem("token");
