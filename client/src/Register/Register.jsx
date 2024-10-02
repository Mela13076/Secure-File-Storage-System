// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import Button from "@mui/material/Button";
// import axios from "axios";
// import { REGISTER_API } from "../constants";

// const Register = () => {
//   // Use the useNavigate hook to get access to the navigate function
//   const navigate = useNavigate();
//   const [error, setError] = useState(null);

//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Handle registration logic here (e.g., API call)
//     console.log("User registered with:", formData);
//     try {
//       const response = await axios.post(REGISTER_API, {
//         email: formData.email,
//         password: formData.password,
//         username: formData.username,
//       });

//       if (response.data) {
//         // Save the token and navigate to another route
//         localStorage.setItem("userData", response.data);
//         navigate("/login");
//       } else {
//         setError("Invalid credentials");
//       }
//     } catch (err) {
//       setError("An error occurred during login");
//     }
//   };

//   return (
//     <div className="login-container">
//       <div>
//         <form>
//           <div>
//             <label>Username:</label>
//             <input
//               type="text"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div>
//             <label>Email:</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div>
//             <label>Password:</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <button variant="contained" onClick={handleSubmit}>
//             Register
//           </button>
//         </form>
//         <Link to="/login" className="center-align-text">
//           Go to Login
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Register;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import axios from "axios";
import { REGISTER_API } from "../constants";
import  Logo  from "../logo"

const Register = () => {
  // Use the useNavigate hook to get access to the navigate function
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [passwordError, setPasswordError] = useState("");

  // Password validation function
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate password as the user types
    if (name === "password") {
      if (!validatePassword(value)) {
        setPasswordError(
          "Password must be at least 8 characters long, include a letter, a number, and a special character."
        );
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if password is valid
    if (!validatePassword(formData.password)) {
      setPasswordError(
        "Password must be at least 8 characters long, include a letter, a number, and a special character."
      );
      return;
    }

    try {
      const response = await axios.post(REGISTER_API, formData);

      if (response.data) {
        // Store the user data or token and navigate to another route
        // localStorage.setItem("userData", response.data);
        navigate("/login");
      } else {
        setError("Invalid registration details");
      }
    } catch (err) {
      setError("An error occurred during registration");
    }
  };

  return (
    <div className="login-container">
      <Logo />
      <div>
        <form onSubmit={handleSubmit}>
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
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
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
            {passwordError && (
              <div style={{ color: "red" }}>{passwordError}</div>
            )}
          </div>
          <Button variant="contained" type="submit">
            Register
          </Button>
        </form>
        <Link to="/login" className="center-align-text">
          Go to Login
        </Link>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default Register;
