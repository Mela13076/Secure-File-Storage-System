import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// const navigate = useNavigate();

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000', // Replace with your API's base URL
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Retrieve the token from localStorage or wherever you have it stored
        if(localStorage.getItem('userData')) {
           const userData = JSON.parse(localStorage.getItem('userData'))
            // If token exists, add it to headers
            if (userData && userData.access) {
                config.headers.Authorization = `Bearer ${userData.access}`;
            }
        }
        return config;
    },
    (error) => {
        // Handle the error
        //navigate('/login');
        return Promise.reject(error);
    }
);

export default axiosInstance;

// const isTokenExpired = (token) => {
//     const decodedToken = jwtDecode(token);
//     const currentTime = Date.now() / 1000;
//     return decodedToken.exp < currentTime;
// };

// const token = localStorage.getItem('authToken');
// if (token && isTokenExpired(token)) {
//     localStorage.removeItem('authToken');
//     window.location.href = '/login';
// }