// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children }) => {
//     console.log(localStorage.getItem('userData'));

//     if (localStorage.getItem('userData')) {
//         const user = JSON.parse(localStorage.getItem('userData'));
//         if (user.access) {
//             return children;
//         } else
//         {
//          return   <Navigate to="/login" />
//         }
//     } else {
//       return  <Navigate to="/login" />
//     }

//     // return token ? children : <Navigate to="/login" />;
//    // return children;
// };

// export default ProtectedRoute;

// import React from "react";
// import { Navigate } from "react-router-dom";
// import jwt_decode from "jwt-decode";

// // Helper function to check if the token is expired
// const isTokenExpired = (token) => {
//   if (!token) return true;
//   const decoded = jwt_decode(token);
//   const currentTime = Date.now() / 1000; // Convert to seconds
//   return decoded.exp < currentTime;
// };

// const ProtectedRoute = ({ children }) => {
//   // Get user data from localStorage
//   const userData = localStorage.getItem("userData");

//   // If no userData is found in localStorage, redirect to login
//   if (!userData) {
//     return <Navigate to="/login" />;
//   }

//   // Parse the stored user data
//   const user = JSON.parse(userData);

//   // Check if the access token exists and is not expired
//   if (user.access && !isTokenExpired(user.access)) {
//     // Token is valid, grant access to children
//     return children;
//   } else {
//     // Token is expired or not present, redirect to login
//     localStorage.removeItem("userData"); // Optionally clear the localStorage
//     return <Navigate to="/login" />;
//   }
// };

// export default ProtectedRoute;

import React from "react";
import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

// Helper function to check if the token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  const decoded = jwt_decode(token);
  const currentTime = Date.now() / 1000; // Convert to seconds
  return decoded.exp < currentTime;
};

const ProtectedRoute = ({ children }) => {
  const userData = localStorage.getItem("userData");

  if (!userData) {
    return <Navigate to="/login" />;
  }

  const user = JSON.parse(userData);

  // Check if the access token has expired
  if (isTokenExpired(user.access)) {
    // Token is expired, log out the user
    localStorage.removeItem("userData");
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
