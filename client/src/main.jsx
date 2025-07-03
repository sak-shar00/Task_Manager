import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext"; // ✅ updated path
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* ✅ Now context will work app-wide */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
