import React, { useState } from "react";
import {
  FaEnvelope,
  FaGithub,
  FaTwitter,
} from "react-icons/fa";
import { SiDiscord } from "react-icons/si";
import "../styles/Footer.css";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", { email, message });
    setEmail("");
    setMessage("");
    alert("Thank you! We received your message. We'll get back to you soon.");
  };

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section footer-contact-form">
          <h3 className="footer-section-title">Contact Us</h3>
          <form onSubmit={handleSubmit} className="contact-form">
            <label htmlFor="footer-email" className="sr-only">
              Your Email
            </label>
            <input
              id="footer-email"
              type="email"
              className="contact-input"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="footer-message" className="sr-only">
              Your Message
            </label>
            <textarea
              id="footer-message"
              className="contact-textarea"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              required
            />

            <button type="submit" className="contact-button">
              Send
            </button>
          </form>
        </div>

        <div className="footer-section footer-links">
          <h3 className="footer-section-title">Explore</h3>
          <ul className="links-list">
            <li>
              <a href="/services" className="footer-link">
                Services
              </a>
            </li>
            <li>
              <a href="/community" className="footer-link">
                Community
              </a>
            </li>
            <li>
              <a href="/support" className="footer-link">
                Support
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section footer-social">
          <h3 className="footer-section-title">Follow Us</h3>
          <div className="social-icons">
            <a
              href="mailto:mayankkumarverma4@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Email"
            >
              <FaEnvelope />
            </a>
            <a
              href="https://github.com/webermayank/Sync-Pad_AI"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href="https://discord.gg/your-server"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Discord"
            >
              <SiDiscord />
            </a>
            <a
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;