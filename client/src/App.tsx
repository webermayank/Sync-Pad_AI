import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EditorPage from "./pages/EditorPage";
import Landing from "./pages/LandingPage";

const App: React.FC = () => {
  return (
    <Router>
      <div className="body-gradient-blobs">
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>
        <div className="blob blob3"></div>
      </div>
      <Routes>
        <Route path="/editor" element={<EditorPage />} />

        <Route path="/" element={<Landing />} />
      </Routes>
    </Router>
  );
};

export default App;
