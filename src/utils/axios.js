import axios from "axios";

//
import { BASE_URL } from "../config";
//Base_Url=>http://localhost:5000
const axiosInstance = axios.create({ baseURL: BASE_URL });
axios.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    )
);

export default axiosInstance;