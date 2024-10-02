import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import Register from './Register/Register';
import Login from './Login/Login';
import ProtectedRoute from './ProtectedRoutes';
import Home from "./Home/Home";
import UploadFiles from './UploadFiles';
import Logo from './logo'
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>} />
                <Route path="/home" element={
                    <ProtectedRoute>
                        <Home />
                        <div className='main-container'>
                            <Logo />
                            <UploadFiles />
                        </div>
                    </ProtectedRoute>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>);
}

export default App;
