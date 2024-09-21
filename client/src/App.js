import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import Register from './Register';
import Login from './Login';


function App() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };
  return (
    <div className="App">
      {isLogin ? <Login /> : <Register />}
      <button onClick={toggleForm}>
        {isLogin ? 'Go to Register' : 'Go to Login'}
      </button>
    </div>
  );
}

export default App;
