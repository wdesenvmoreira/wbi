import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5412/API/",
});

export default api;