import "./App.css";
import Image from "./assets/logo.png";

function Logo() {
  return (
    <div className="logo-container">
      <img
        className="logo"
        src={Image}
        alt="CloudLock Secure Logo"
        width="300"
        height="auto"
      />
      <h2 className="app-name">CloudLock Secure</h2>
    </div>
  );
}

export default Logo;
