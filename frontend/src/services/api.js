import axios from "axios";

const api = axios.create({
  baseURL: "https://support-crm-system-jsoz.onrender.com/api",
});

export default api;
