import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import githubLogo from '../assets/githubLogo.png';
import '../styles/Navbar.css'; // Import the CSS file

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  // Placeholder for SignIn functionality
  const handleSignIn = () => {
    // Replace this with your actual authentication logic (e.g., Firebase, Auth0)
    console.log('SignIn clicked - Implement authentication here');
    // Example: navigate to a sign-in page or trigger a modal
    navigate('/signin');
  };

  return (
    <nav className="navbar">
      {/* Left Side: Logo and Navigation Links */}
      <div className="navbar-left">
        {/* Syncpad Logo */}
        <Link to="/" className="navbar-logo">
          SYNCPAD
        </Link>
        
        {/* Home Link */}
        <Link to="/" className="navbar-link">
          Home
        </Link>
        
        {/* Editor Link */}
        <Link to="/editor" className="navbar-link">
          Editor
        </Link>
      </div>

      {/* Right Side: GitHub Logo and SignIn */}
      <div className="navbar-right">
        {/* GitHub Logo Button */}
        <a
          href="https://github.com/webermayank/Sync-Pad_AI" // Replace with your actual GitHub repo URL
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
        >
          <img
            src={githubLogo}
            alt="GitHub Logo"
            className="github-logo"
          />
        </a>

        {/* SignIn Button */}
        <button
          onClick={handleSignIn}
          className="signin-button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="signin-icon"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          <span>SignIn</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;