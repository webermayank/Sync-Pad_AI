import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import EditorPage from "./pages/EditorPage";
import Landing from "./pages/LandingPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/editor" element={<EditorPage />} />

        <Route path="/" element={<Landing />} />
      </Routes>
    </Router>
  );
};

export default App;
