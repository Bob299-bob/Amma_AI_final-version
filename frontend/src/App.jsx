import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./Pages/Home";
import Schedule from "./pages/Schedule";
import Medicine from "./pages/Medicine";
import Exercise from "./pages/Exercise";
import Reports from "./pages/Reports";
import Entertainment from "./pages/Entertainment";
import HealthProfile from "./Pages/Healthprofile";
import Register from "./pages/Register";

import Chat from "./pages/Chat";
import EnglishChat from "./Pages/englishchat";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/home" element={<Home />} />

        <Route
          path="/health-profile"
          element={<HealthProfile />}
        />

        <Route
          path="/schedule"
          element={<Schedule />}
        />

        <Route
          path="/medicine"
          element={<Medicine />}
        />

        <Route
          path="/exercise"
          element={<Exercise />}
        />

        <Route
          path="/reports"
          element={<Reports />}
        />

        <Route
          path="/entertainment"
          element={<Entertainment />}
        />

        {/* Hindi Chat */}
        <Route
          path="/chat"
          element={<Chat />}
        />

        {/* English Chat */}
        <Route
          path="/chat/english"
          element={<EnglishChat />}
        />
        <Route path="/register" element={<Register />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;