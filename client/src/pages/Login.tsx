import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { login, setToken } from "../services/auth";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { token } = await login({ email, password });
      setToken(token);
      navigate("/editor");
    } catch (err: unknown) {
      console.error(err);

      if (err instanceof Error && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        setError(axiosError.response?.data?.message || "Login failed, try again.");
      } else {
        setError("Login failed, try again.");
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">Log In</h2>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="email" className="auth-label">
            Your email
          </label>
          <input
            id="email"
            type="email"
            className="auth-input"
            placeholder="Your email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password" className="auth-label">
            Your password
          </label>
          <input
            id="password"
            type="password"
            className="auth-input"
            placeholder="Your password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="auth-button">
            Log In
          </button>
        </form>

        <p className="auth-footer">
          Don’t have an account?{" "}
          <a className="auth-link" href="/register">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
