import { useNavigate } from "react-router-dom";
import "../index.css";
import { useEffect, useState } from "react";
import API from "../api/api";

function Home() {
  const navigate = useNavigate();

  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await API.get("/api/reminders/today");

      setReminders(response.data.reminders);
    } catch (error) {
      console.error("Reminder fetch error:", error);
    }
  };

  const modules = [
    {
      icon: "📅",
      title: "Daily Schedule",
      subtitle: "Aaj Ka Din",
      path: "/schedule",
    },
    {
      icon: "💊",
      title: "Medicine Reminder",
      subtitle: "Dawai",
      path: "/medicine",
    },
    {
      icon: "❤️",
      title: "Health Profile",
      subtitle: "Ammaa ki Health",
      path: "/health-profile",
    },
    {
      icon: "🩺",
      title: "Reports",
      subtitle: "Medical Reports",
      path: "/reports",
    },
    {
      icon: "🏃",
      title: "Exercise",
      subtitle: "Daily Exercise",
      path: "/exercise",
    },
    {
      icon: "📺",
      title: "Entertainment",
      subtitle: "TV & Music",
      path: "/entertainment",
    },
    {
      icon: "🤖",
      title: "AI Assistant",
      subtitle: "Bataiye ky madad kr skte hai",
      path: "/chat",
    },
  ];

  return (
    <div className="home-container">

      {/* HEADER */}
      <header className="home-header">

        <div>
          <h1>❤️ Ammaa AI</h1>
        </div>

        <div className="profile">
          🧑
        </div>

        <button
          className="logout-button"
          onClick={() => navigate("/")}
        >
          Logout
        </button>

      </header>


      {/* WELCOME */}
      <div className="welcome-card">

        <h2>Namaste 🙏</h2>

        <p>
          Have a good day (Aaj ka din accha rahega) ❤️
        </p>

        <div className="assistant-actions">

          <button onClick={() => navigate("/chat")}>
            🎙️ AI Assistant
          </button>

          <select
            className="language-select"
            defaultValue=""
            onChange={(e) => {
              const language = e.target.value;

              if (language === "hindi") {
                navigate("/chat");
              }

              if (language === "english") {
                navigate("/chat/english");
              }
            }}
    >
            <option value="" disabled>
              🌐 Select Language
            </option>

            <option value="hindi">
              🇮🇳 Hindi
            </option>

            <option value="english">
              🇬🇧 English
            </option>
          </select>

        </div>

      </div>


      {/* MODULES */}
      <h2 className="section-title">
        Aaj Aap Kya Karna Chahti Hain?
      </h2>

      <div className="module-grid">

        {modules.map((module) => (

          <button
            key={module.path}
            className="module-card"
            onClick={() => navigate(module.path)}
          >

            <span className="module-icon">
              {module.icon}
            </span>

            <span className="module-title">
              {module.title}
            </span>

            <span className="module-subtitle">
              {module.subtitle}
            </span>

          </button>

        ))}

      </div>


      {/* TODAY'S REMINDERS */}
      <div className="today-card">

        <h2>📅 Aaj Ke Important Kaam</h2>

        {reminders.length === 0 ? (

          <p>
            Aaj koi reminder nahi hai ❤️
          </p>

        ) : (

          reminders.map((reminder, index) => (

            <div
              className="reminder-card"
              key={index}
            >

              <div>

                <strong>
                  {reminder.time}
                </strong>

                <p>
                  {reminder.type === "medicine" && "💊 "}
                  {reminder.type === "schedule" && "📅 "}
                  {reminder.type === "exercise" && "🏃 "}

                  {reminder.message}
                </p>

              </div>

              <button>
                🔔
              </button>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default Home;