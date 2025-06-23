import React from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import EditorPage from "./pages/EditorPage";
import Landing from "./pages/LandingPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { getToken} from "./services/auth";
import './styles/main.css'
import Dashboard from "./components/Dashboard";


const App: React.FC = () => {

  const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const token = getToken();
    return token ? (children) : (<Navigate to='/login' replace />)
  }
  
  return (
    <BrowserRouter>
  
      <div className="body-gradient-blobs">
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>
        <div className="blob blob3"></div>
      </div>
      <Routes>
        
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

        <Route path="/editor" element={
          <RequireAuth>
             <EditorPage />
             
          </RequireAuth>
          } 
          />
        <Route path="/dashboard" element={
          <RequireAuth>
            <Dashboard />

          </RequireAuth>
        }
        />

        <Route path="/" element={<Landing />} />
      </Routes>
    </BrowserRouter>

  );
};

export default App;
