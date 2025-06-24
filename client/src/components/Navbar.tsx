import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import githubLogo from '../assets/githubLogo.png';
import '../styles/Navbar.css';
import { getToken, logout } from '../services/auth';
import { getUserProfile, type UserProfile } from '../services/userService';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const token = getToken();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (token) {
      getUserProfile().then(setUserProfile).catch(() => setUserProfile(null));
    }
  }, [token]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleSignIn = () => {
    navigate('/register');
  };

  const handleSignOut = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  const handleDashboard = () => {
    setDropdownOpen(false);
    navigate('/dashboard');
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

        {token ? (
          <div className="user-dropdown" ref={dropdownRef}>
            <button
              className="signin-button"
              onClick={() => setDropdownOpen((open) => !open)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="signin-icon"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <span>{userProfile?.displayName || 'Account'}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="currentColor"
                style={{ marginLeft: 4 }}
              >
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.084l3.71-3.853a.75.75 0 111.08 1.04l-4.24 4.4a.75.75 0 01-1.08 0l-4.24-4.4a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-displayname">
                  {userProfile?.displayName || userProfile?.email || 'User'}
                </div>
                <button className="dropdown-item" onClick={handleDashboard}>
                  Dashboard
                </button>
                <button className="dropdown-item" onClick={handleSignOut}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={handleSignIn} className="signin-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="signin-icon"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span>Sign In</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;