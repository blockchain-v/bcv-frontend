const BACKEND_URL = process.env.VUE_APP_BACKEND_URL;

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

const ENDPOINTS = {
  TOKEN: "token",
};

export { BACKEND_URL, DEFAULT_HEADERS, ENDPOINTS };
