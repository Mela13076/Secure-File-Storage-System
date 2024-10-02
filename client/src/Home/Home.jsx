import * as React from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import api from "../api"; // Import the Axios instance with token interceptor
import { LOGOUT_API } from "../constants";

export default function Home() {
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userData, setUser] = React.useState(
    JSON.parse(localStorage.getItem("userData"))
  );

  const navigate = useNavigate(); // For redirecting to login page

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const refreshToken = userData.refresh;
      const accessToken = userData.access; // Make sure the access token is also retrieved

      // Set the Authorization header with the access token
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include access token in the header
        },
      };

      // Make the API call to logout with the refresh token in the body
      await api.post(LOGOUT_API, { refresh: refreshToken }, config);

      // Clear user data from localStorage
      localStorage.removeItem("userData");

      // Redirect to the login page
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      // Optionally show an error message to the user
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Files
          </Typography>
          {auth && (
            <div>
              <span> {userData.user.username}</span>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => {
                    handleClose(); // Close the menu
                    handleLogout(); // Call logout
                  }}
                >
                  Signout
                </MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
