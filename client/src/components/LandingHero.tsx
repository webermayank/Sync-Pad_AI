import React, { useEffect } from 'react';
import { FallingText } from "../animations/FallingText";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import '../styles/Landing.css';

const LandingHero: React.FC = () => {
  const navigate = useNavigate();

  // Track mouse movement for interactive background
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${(e.clientX / window.innerWidth) * 100}%`);
      document.documentElement.style.setProperty('--mouse-y', `${(e.clientY / window.innerHeight) * 100}%`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="landing-hero">
      {/* Animated background particles */}
      <div className="background-particles">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Gradient orbs */}
      <div className="gradient-orb-1"></div>
      <div className="gradient-orb-2"></div>
      <div className="gradient-orb-3"></div>

      <section className="landing-hero__section">
        <Navbar />
        <FallingText text="SYNC-PAD" />
        <div className="landing-hero__subtitle">
          Intelligent Docs
        </div>

        <button
          onClick={() => navigate("/editor")}
          className="landing-hero__button"
        >
          Let's goooo
        </button>
        <div className="landing-hero__warning">
          Enhance your writing with AI
        </div>
      </section>
    </div>
  );
};

export default LandingHero;