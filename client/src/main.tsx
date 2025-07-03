// client/src/main.jsx (or index.jsx)
import React from "react";
import ReactDOM from "react-dom/client";
import {FileContentProvider} from "./context/FileContentContext.tsx"
import "./index.css";
import App from "./App";
import axios from "axios";
import { getToken } from "./services/auth.ts";
import "./styles/main.css";

const token = getToken();

if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

axios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("asksync_token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
  <FileContentProvider>
    <App />
  </FileContentProvider>
  </React.StrictMode>
);
