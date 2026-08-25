import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import API from "../api/api";

function Schedule() {
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newActivity, setNewActivity] = useState({
    time: "",
    title: "",
    icon: "📌",
  });

  // =========================
  // GET SCHEDULES
  // =========================

  const fetchActivities = async () => {
    try {
      setLoading(true);

      const response = await API.get("/api/schedule/");

      console.log("Schedule response:", response.data);

      // Backend response:
      // {
      //   success: true,
      //   schedules: [...]
      // }

      const schedules = response.data?.schedules || [];

      const data = schedules.map((activity) => ({
        id: activity._id,
        time: activity.time || "",
        title: activity.title || "",
        icon: activity.icon || "📌",
        active: activity.active ?? true,
        done: false,
      }));

      setActivities(data);

    } catch (error) {
      console.error(
        "Schedule fetch error:",
        error.response?.data || error
      );

      setActivities([]);

      // Token expire / invalid
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
      }

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    fetchActivities();
  }, []);

  // =========================
  // ADD ACTIVITY
  // =========================

  const addActivity = async (e) => {
    e.preventDefault();

    if (!newActivity.time || !newActivity.title.trim()) {
      alert("Activity aur time fill karein");
      return;
    }

    setSaving(true);

    try {
      const activityData = {
        title: newActivity.title.trim(),
        time: newActivity.time,
        icon: newActivity.icon,
        active: true,
      };

      console.log(
        "Adding schedule:",
        activityData
      );

      const response = await API.post(
        "/api/schedule/",
        activityData
      );

      console.log(
        "Schedule added:",
        response.data
      );

      // Form reset
      setNewActivity({
        time: "",
        title: "",
        icon: "📌",
      });

      setShowForm(false);

      // Database se fresh data load
      await fetchActivities();

    } catch (error) {
      console.error(
        "Add schedule error:",
        error.response?.data || error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
        return;
      }

      alert(
        error.response?.data?.detail ||
        "Activity save nahi hui"
      );

    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE ACTIVITY
  // =========================

  const deleteActivity = async (id) => {
    if (!id) return;

    try {
      await API.delete(
        `/api/schedule/${id}`
      );

      // Previous state se remove
      setActivities((prev) =>
        prev.filter(
          (activity) => activity.id !== id
        )
      );

    } catch (error) {
      console.error(
        "Delete schedule error:",
        error.response?.data || error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
        return;
      }

      alert(
        error.response?.data?.detail ||
        "Activity delete nahi hui"
      );
    }
  };

  // =========================
  // TOGGLE DONE
  // =========================

  const toggleDone = (id) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === id
          ? {
              ...activity,
              done: !activity.done,
            }
          : activity
      )
    );
  };

  // =========================
  // TODAY DATE
  // =========================

  const today = new Date();

  const dayName = today.toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
    }
  );

  const date = today.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
    }
  );

  // =========================
  // UI
  // =========================

  return (
    <div className="schedule-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="page-header">

        <button
          className="back-button"
          onClick={() => navigate("/home")}
        >
          ←
        </button>

        <div>
          <h1>📅 Aaj Ka Din</h1>

          <p>
            Ammaa ka daily schedule ❤️
          </p>
        </div>

      </div>


      {/* =========================
          DATE
      ========================= */}

      <div className="date-card">

        <div>

          <p className="date-day">
            {dayName}
          </p>

          <h2>
            {date}
          </h2>

        </div>

        <span className="date-icon">
          🌸
        </span>

      </div>


      {/* =========================
          LOADING
      ========================= */}

      {loading && (

        <p
          style={{
            textAlign: "center",
            margin: "20px",
          }}
        >
          Schedule loading...
        </p>

      )}


      {/* =========================
          ACTIVITIES
      ========================= */}

      {!loading && (

        <div className="schedule-list">

          {activities.length === 0 ? (

            <div className="empty-schedule">

              <div>
                📅
              </div>

              <h3>
                Aaj koi activity nahi hai
              </h3>

              <p>
                + Add Activity se activity
                add karein.
              </p>

            </div>

          ) : (

            activities.map((activity) => (

              <div
                key={activity.id}
                className={`activity-card ${
                  activity.done
                    ? "activity-done"
                    : ""
                }`}
              >

                {/* ICON */}

                <div className="activity-icon">
                  {activity.icon}
                </div>


                {/* INFORMATION */}

                <div className="activity-info">

                  <span className="activity-time">
                    {activity.time}
                  </span>

                  <h3>
                    {activity.title}
                  </h3>

                  <span
                    className={
                      activity.done
                        ? "status-done"
                        : "status-pending"
                    }
                  >
                    {activity.done
                      ? "✓ Completed"
                      : "○ Pending"}
                  </span>

                </div>


                {/* ACTIONS */}

                <div className="activity-actions">

                  <button
                    className="done-button"
                    onClick={() =>
                      toggleDone(activity.id)
                    }
                  >
                    {activity.done
                      ? "↩"
                      : "✓"}
                  </button>


                  <button
                    className="delete-button"
                    onClick={() =>
                      deleteActivity(
                        activity.id
                      )
                    }
                  >
                    🗑️
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      )}


      {/* =========================
          ADD BUTTON
      ========================= */}

      {!showForm && (

        <button
          className="add-activity-button"
          onClick={() =>
            setShowForm(true)
          }
        >
          + Add Activity
        </button>

      )}


      {/* =========================
          ADD FORM
      ========================= */}

      {showForm && (

        <div className="activity-form">

          <div className="form-header">

            <h2>
              ➕ New Activity
            </h2>

            <button
              type="button"
              onClick={() =>
                setShowForm(false)
              }
              className="close-form"
            >
              ✕
            </button>

          </div>


          <form onSubmit={addActivity}>

            {/* ACTIVITY */}

            <label>
              Activity
            </label>

            <input
              type="text"
              placeholder="e.g. Lunch"
              value={newActivity.title}
              onChange={(e) =>
                setNewActivity({
                  ...newActivity,
                  title: e.target.value,
                })
              }
              required
            />


            {/* TIME */}

            <label>
              Time
            </label>

            <input
              type="time"
              value={newActivity.time}
              onChange={(e) =>
                setNewActivity({
                  ...newActivity,
                  time: e.target.value,
                })
              }
              required
            />


            {/* ICON */}

            <label>
              Icon
            </label>

            <select
              value={newActivity.icon}
              onChange={(e) =>
                setNewActivity({
                  ...newActivity,
                  icon: e.target.value,
                })
              }
            >

              <option value="📌">
                📌 General
              </option>

              <option value="🍳">
                🍳 Food
              </option>

              <option value="💊">
                💊 Medicine
              </option>

              <option value="🏃">
                🏃 Exercise
              </option>

              <option value="🧘">
                🧘 Meditation
              </option>

              <option value="😴">
                😴 Rest
              </option>

              <option value="📺">
                📺 Entertainment
              </option>

            </select>


            {/* SAVE */}

            <button
              type="submit"
              className="save-activity-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Activity"}
            </button>

          </form>

        </div>

      )}

    </div>
  );
}

export default Schedule;