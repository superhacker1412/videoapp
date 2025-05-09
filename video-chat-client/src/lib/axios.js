// import axios from "axios";

// export const axiosInstance = axios.create({
//     baseURL: import.meta.env.MODE==="development" ? "http://192.168.100.230:5001/api" : "/api",
//     withCredentials:true,
// })


import axios from "axios";



export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_NODE_ENV === "development"
      ? `http://${import.meta.env.VITE_BASE_URL}:${import.meta.env.VITE_PORT}/api`
      : "/api",
      withCredentials:true,
  });

  console.log("BASE_URL:", import.meta.env.VITE_BASE_URL);
console.log("PORT:", import.meta.env.VITE_PORT);