import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import axios from 'axios';
import { LOGIN_API } from "../constants";
const Login = () => {
  // Use the useNavigate hook to get access to the navigate function
  const navigateTo = useNavigate();
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(LOGIN_API, {
        username: formData.username,
        password: formData.password
      });

      if (response.data.token) {
        // Save the token and navigate to another route
        localStorage.setItem('authToken', response.data.token);
        navigateTo('/home');  
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred during login');
    }
  };

  return (
    <div className='login-container'>
      <div>
        {/* <h2 className='center-align-text'>Login</h2> */}
        <form>
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <Button variant="contained" onClick={handleSubmit}>Login</Button>
        </form>
        <Link to="/register" className='center-align-text'>
          Go to Register
        </Link>
      </div>
    </div>
  );
};

export default Login;
