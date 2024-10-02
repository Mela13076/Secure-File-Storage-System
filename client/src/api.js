// import axios from "axios";

// // Create an Axios instance
// const api = axios.create({
//   baseURL: "http://127.0.0.1:8000", // Your API base URL
// });

// // Add an interceptor to include the access token in all requests
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default api;

// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://127.0.0.1:8000", // Update with your actual backend URL
// });

// // Add an interceptor to include the access token in all requests
// api.interceptors.request.use(
//   (config) => {
//     const userData = localStorage.getItem("userData");
//     if (userData) {
//       const token = JSON.parse(userData).access;
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default api;

// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// // Create an Axios instance
// const api = axios.create({
//   baseURL: "http://127.0.0.1:8000", // Your API base URL
// });

// // Add an interceptor to include the access token in all requests
// api.interceptors.request.use(
//   (config) => {
//     const userData = localStorage.getItem("userData");
//     if (userData) {
//       const token = JSON.parse(userData).access;
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Add an interceptor to handle expired token (401 error)
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Token has expired or is invalid
//       localStorage.removeItem("userData"); // Remove user data from local storage
//       localStorage.removeItem("accessToken"); // Remove access token from local storage

//       // Redirect to the login page
//       const navigate = useNavigate();
//       navigate("/login");

//       // Optionally, you could dispatch a logout action if you're using a global state manager like Redux
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;

import axios from "axios";
import jwt_decode from "jwt-decode"; // Ensure you have this package installed

const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // Update with your actual backend URL
});

// Helper function to check if the token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  const decoded = jwt_decode(token);
  const currentTime = Date.now() / 1000; // Convert to seconds
  return decoded.exp < currentTime;
};

// Add an interceptor to include the access token in all requests
api.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem("userData");

    // Skip token expiry check for specific APIs (e.g., all-files)
    // if (config.url.includes("all-files")) {
    //   return config; // Allow the request to proceed without checking token expiry
    // }

    if (userData) {
      const token = JSON.parse(userData).access;

      // Check if the access token is expired
      if (isTokenExpired(token)) {
        localStorage.removeItem("userData");
        window.location.href = "/login"; // Redirect to login if token is expired
      } else {
        // Attach token to Authorization header if it's not expired
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
