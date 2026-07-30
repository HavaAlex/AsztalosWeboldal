import axios from "axios";

const axiosClient = axios.create({
    baseURL: 'http://localhost:3000/api/',
})
axiosClient.defaults.withCredentials = true

export default axiosClient