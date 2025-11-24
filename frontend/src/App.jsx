import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { LiveMonitoringPage } from "./pages/LiveMonitoringPage";
import { ManualControlPage } from "./pages/ManualControlPage";
import { AboutRobotPage } from "./pages/AboutRobotPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/live-monitoring" element={<LiveMonitoringPage />} />
          <Route path="/manual-control" element={<ManualControlPage />} />
          <Route path="/about" element={<AboutRobotPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
