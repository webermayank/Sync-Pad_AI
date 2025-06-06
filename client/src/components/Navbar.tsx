import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import githubLogo from '../assets/githubLogo.png';
import '../styles/Navbar.css';
const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    console.log('SignIn clicked - Implement authentication here');
    navigate('/signin');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          SYNCPAD
        </Link>

        <Link to="/" className="navbar-link">
          Home
        </Link>

        {/* Editor Link */}
        <Link to="/editor" className="navbar-link">
          Editor
        </Link>
      </div>

      <div className="navbar-right">
        <a
          href="https://github.com/webermayank/Sync-Pad_AI" 
          className="github-button"
          data-icon="octicon-star"
          data-size="large"
          data-show-count="true"
          aria-label="Star your-username/your-repo on GitHub"
        >
         <img src={githubLogo} alt="GitHub Logo" className="github-logo" />
        </a>

        <button onClick={handleSignIn} className="signin-button">
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