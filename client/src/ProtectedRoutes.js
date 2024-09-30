import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    console.log(localStorage.getItem('userData'));
    
    if (localStorage.getItem('userData')) {
        const user = JSON.parse(localStorage.getItem('userData'));
        if (user.access) {
            return children;
        } else
        {
         return   <Navigate to="/login" />
        }
    } else {
      return  <Navigate to="/login" />
    }

    // return token ? children : <Navigate to="/login" />;
   // return children;
};

export default ProtectedRoute;
