import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import API from "../api/api";

function Exercise() {
  const navigate = useNavigate();

  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [newExercise, setNewExercise] = useState({
    name: "",
    time: "",
    duration: "",
    difficulty: "Easy",
    icon: "🏃‍♀️",
  });

  // =========================
  // GET EXERCISES
  // =========================

  const fetchExercises = async () => {
    try {
      setLoading(true);

      const response = await API.get("/api/exercises/");

      // Backend direct list return kar raha hai
      const exerciseList = Array.isArray(response.data)
        ? response.data
        : response.data.exercises || [];

      const data = exerciseList.map((exercise) => ({
        id: exercise._id,
        name: exercise.name,
        time: exercise.time,
        duration: exercise.duration,
        difficulty: exercise.difficulty || "Easy",
        icon: exercise.icon || "🏃‍♀️",
        done: exercise.done || false,
      }));

      setExercises(data);
    } catch (error) {
      console.error("Exercise fetch error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      alert("Exercise load nahi ho rahi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    setNewExercise({
      ...newExercise,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // ADD EXERCISE
  // =========================

  const addExercise = async (e) => {
    e.preventDefault();

    if (
      !newExercise.name ||
      !newExercise.time ||
      !newExercise.duration
    ) {
      alert("Exercise name, time aur duration fill karein");
      return;
    }

    try {
      const exerciseData = {
        name: newExercise.name,
        time: newExercise.time,
        duration: newExercise.duration,
        difficulty: newExercise.difficulty,
        icon: newExercise.icon,
        done: false,
        active: true,
      };

      await API.post(
        "/api/exercises/",
        exerciseData
      );

      setNewExercise({
        name: "",
        time: "",
        duration: "",
        difficulty: "Easy",
        icon: "🏃‍♀️",
      });

      setShowForm(false);

      await fetchExercises();

    } catch (error) {
      console.error("Add exercise error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      alert(
        error.response?.data?.detail ||
        "Exercise save nahi hui"
      );
    }
  };

  // =========================
  // DELETE EXERCISE
  // =========================

  const deleteExercise = async (id) => {
    try {
      await API.delete(
        `/api/exercises/${id}`
      );

      setExercises((prev) =>
        prev.filter(
          (exercise) => exercise.id !== id
        )
      );

    } catch (error) {
      console.error(
        "Delete exercise error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      alert(
        error.response?.data?.detail ||
        "Exercise delete nahi hui"
      );
    }
  };

  // =========================
  // TOGGLE DONE
  // =========================

  const toggleDone = (id) => {
    setExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === id
          ? {
              ...exercise,
              done: !exercise.done,
            }
          : exercise
      )
    );
  };

  // =========================
  // COMPLETED COUNT
  // =========================

  const completed = exercises.filter(
    (exercise) => exercise.done
  ).length;

  // =========================
  // UI
  // =========================

  return (
    <div className="exercise-page">

      {/* HEADER */}

      <div className="page-header">

        <button
          className="back-button"
          onClick={() => navigate("/home")}
        >
          ←
        </button>

        <div>
          <h1>🏃 Exercise</h1>
          <p>
            Ammaa ki daily activity
          </p>
        </div>

      </div>


      {/* SUMMARY */}

      <div className="exercise-summary">

        <div className="exercise-summary-card">

          <span>🏃‍♀️</span>

          <div>
            <strong>
              {exercises.length}
            </strong>

            <p>
              Exercises
            </p>
          </div>

        </div>


        <div className="exercise-summary-card">

          <span>✓</span>

          <div>
            <strong>
              {completed}
            </strong>

            <p>
              Completed
            </p>
          </div>

        </div>

      </div>


      {/* MOTIVATION */}

      <div className="exercise-motivation">

        <div>
          🌸
        </div>

        <div>

          <h2>
            Thoda Exercise, Better Health ❤️
          </h2>

          <p>
            Aaj halka exercise zaroor karein.
          </p>

        </div>

      </div>


      {/* TITLE */}

      <h2 className="exercise-title">
        Today's Exercise
      </h2>


      {/* LOADING */}

      {loading && (
        <div className="empty-schedule">
          <div>⏳</div>
          <h3>Exercise loading...</h3>
        </div>
      )}


      {/* EXERCISE LIST */}

      {!loading && (
        <div className="exercise-list">

          {exercises.length === 0 ? (

            <div className="empty-schedule">

              <div>
                🏃‍♀️
              </div>

              <h3>
                No exercise added
              </h3>

              <p>
                + Add Exercise se exercise
                add karein.
              </p>

            </div>

          ) : (

            exercises.map((exercise) => (

              <div
                className={`exercise-card ${
                  exercise.done
                    ? "exercise-done"
                    : ""
                }`}
                key={exercise.id}
              >

                {/* ICON */}

                <div className="exercise-icon">
                  {exercise.icon}
                </div>


                {/* INFO */}

                <div className="exercise-info">

                  <h3>
                    {exercise.name}
                  </h3>

                  <p>
                    🕐 {exercise.time}
                  </p>

                  <p>
                    ⏱️ {exercise.duration}
                  </p>

                  <span
                    className={
                      exercise.difficulty === "Easy"
                        ? "difficulty-easy"
                        : exercise.difficulty === "Medium"
                        ? "difficulty-medium"
                        : "difficulty-hard"
                    }
                  >
                    {exercise.difficulty}
                  </span>

                  <br />

                  <span
                    className={
                      exercise.done
                        ? "status-done"
                        : "status-pending"
                    }
                  >
                    {exercise.done
                      ? "✓ Completed"
                      : "○ Pending"}
                  </span>

                </div>


                {/* ACTIONS */}

                <div className="exercise-actions">

                  <button
                    className={
                      exercise.done
                        ? "exercise-taken"
                        : "exercise-take"
                    }
                    onClick={() =>
                      toggleDone(exercise.id)
                    }
                  >
                    {exercise.done
                      ? "✓"
                      : "Done"}
                  </button>


                  <button
                    className="delete-button"
                    onClick={() =>
                      deleteExercise(
                        exercise.id
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


      {/* ADD EXERCISE BUTTON */}

      {!showForm && (

        <button
          className="add-activity-button"
          onClick={() =>
            setShowForm(true)
          }
        >
          + Add Exercise
        </button>

      )}


      {/* ADD FORM */}

      {showForm && (

        <div className="exercise-form">

          <div className="form-header">

            <h2>
              ➕ Add Exercise
            </h2>

            <button
              className="close-form"
              onClick={() =>
                setShowForm(false)
              }
            >
              ✕
            </button>

          </div>


          <form onSubmit={addExercise}>

            {/* NAME */}

            <label>
              Exercise Name
            </label>

            <input
              name="name"
              type="text"
              placeholder="e.g. Morning Walk"
              value={newExercise.name}
              onChange={handleChange}
              required
            />


            {/* TIME */}

            <label>
              Time
            </label>

            <input
              name="time"
              type="time"
              value={newExercise.time}
              onChange={handleChange}
              required
            />


            {/* DURATION */}

            <label>
              Duration
            </label>

            <input
              name="duration"
              type="text"
              placeholder="e.g. 20 min"
              value={newExercise.duration}
              onChange={handleChange}
              required
            />


            {/* DIFFICULTY */}

            <label>
              Difficulty
            </label>

            <select
              name="difficulty"
              value={newExercise.difficulty}
              onChange={handleChange}
            >

              <option value="Easy">
                Easy
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Hard">
                Hard
              </option>

            </select>


            {/* ICON */}

            <label>
              Icon
            </label>

            <select
              name="icon"
              value={newExercise.icon}
              onChange={handleChange}
            >

              <option value="🚶‍♀️">
                🚶‍♀️ Walking
              </option>

              <option value="🧘‍♀️">
                🧘‍♀️ Yoga
              </option>

              <option value="🏃‍♀️">
                🏃‍♀️ Exercise
              </option>

              <option value="🤸‍♀️">
                🤸‍♀️ Stretching
              </option>

            </select>


            {/* SAVE */}

            <button
              type="submit"
              className="save-activity-button"
            >
              Save Exercise
            </button>

          </form>

        </div>

      )}

    </div>
  );
}

export default Exercise;