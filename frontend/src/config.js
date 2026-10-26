const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined" && window.location.origin) {
    return `${window.location.origin}/api/v1`;
  }
  return "/api/v1";
};

export const BASE_URL = getBaseUrl();

export const getToken = () => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("token");
  return stored && stored !== "null" && stored !== "undefined" ? stored : null;
};

export const token = getToken();
