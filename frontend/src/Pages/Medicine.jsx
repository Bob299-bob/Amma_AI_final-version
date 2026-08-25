import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import API from "../api/api";

function Medicine() {
  const navigate = useNavigate();

  const [medicines, setMedicines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newMedicine, setNewMedicine] = useState({
    name: "",
    dose: "",
    time: "",
    food: "After Food",
    period: "Morning",
  });

  // =========================
  // GET MEDICINES
  // =========================

  const fetchMedicines = async () => {
    try {
      const response = await API.get("/api/medicines/");

      const data = response.data.map((medicine) => ({
        id: medicine._id,
        name: medicine.medicine_name,
        dose: medicine.dose,
        time: medicine.time,
        food: medicine.before_after_food,
        period: getPeriod(medicine.time),
        taken: false,
      }));

      setMedicines(data);
    } catch (error) {
      console.error("Medicine fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // TIME → PERIOD
  // =========================

  const getPeriod = (time) => {
    const hour = parseInt(time.split(":")[0]);

    if (hour < 12) return "Morning";
    if (hour < 17) return "Afternoon";
    if (hour < 20) return "Evening";

    return "Night";
  };

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    fetchMedicines();
  }, []);

  // =========================
  // TOGGLE TAKEN
  // =========================

  const toggleTaken = (id) => {
    setMedicines(
      medicines.map((medicine) =>
        medicine.id === id
          ? {
              ...medicine,
              taken: !medicine.taken,
            }
          : medicine
      )
    );
  };

  // =========================
  // DELETE MEDICINE
  // =========================

  const deleteMedicine = async (id) => {
    try {
      await API.delete(`/api/medicines/${id}`);

      setMedicines(
        medicines.filter(
          (medicine) => medicine.id !== id
        )
      );

    } catch (error) {
      console.error("Delete medicine error:", error);
      alert("Medicine delete nahi hui");
    }
  };

  // =========================
  // ADD MEDICINE
  // =========================

  const addMedicine = async (e) => {
    e.preventDefault();

    if (
      !newMedicine.name ||
      !newMedicine.dose ||
      !newMedicine.time
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {

      const medicineData = {
        medicine_name: newMedicine.name,
        dose: newMedicine.dose,
        time: newMedicine.time,
        before_after_food: newMedicine.food,
        days: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        active: true,
      };

      await API.post(
        "/api/medicines/",
        medicineData
      );

      // Form reset
      setNewMedicine({
        name: "",
        dose: "",
        time: "",
        food: "After Food",
        period: "Morning",
      });

      setShowForm(false);

      // Database se fresh data
      fetchMedicines();

    } catch (error) {

      console.error(
        "Add medicine error:",
        error
      );

      alert("Medicine save nahi hui");
    }
  };

  return (
    <div className="medicine-page">

      {/* Header */}

      <div className="page-header">

        <button
          className="back-button"
          onClick={() => navigate("/home")}
        >
          ←
        </button>

        <div>
          <h1>💊 Medicines</h1>
          <p>Ammaa ki medicines</p>
        </div>

      </div>


      {/* Loading */}

      {loading && (
        <p style={{ textAlign: "center" }}>
          Medicines loading...
        </p>
      )}


      {/* Today's summary */}

      <div className="medicine-summary">

        <div>
          <span>💊</span>

          <div>
            <strong>
              {medicines.length}
            </strong>

            <p>Total Medicines</p>
          </div>
        </div>


        <div>

          <span>✓</span>

          <div>

            <strong>
              {
                medicines.filter(
                  (m) => m.taken
                ).length
              }
            </strong>

            <p>Taken</p>

          </div>

        </div>

      </div>


      {/* Medicine List */}

      <h2 className="medicine-section-title">
        Today's Medicines
      </h2>


      <div className="medicine-list">

        {medicines.length === 0 ? (

          <div className="empty-schedule">

            <div>💊</div>

            <h3>
              No medicine added
            </h3>

            <p>
              + Add Medicine se medicine
              add karein.
            </p>

          </div>

        ) : (

          medicines.map((medicine) => (

            <div
              key={medicine.id}
              className={`medicine-card ${
                medicine.taken
                  ? "medicine-taken"
                  : ""
              }`}
            >

              <div className="medicine-icon">
                💊
              </div>


              <div className="medicine-info">

                <div className="medicine-top">

                  <h3>
                    {medicine.name}
                  </h3>

                  <span className="medicine-period">
                    {medicine.period}
                  </span>

                </div>


                <p className="medicine-dose">
                  {medicine.dose}
                </p>


                <p className="medicine-time">
                  🕐 {medicine.time}
                </p>


                <p className="medicine-food">
                  🍽️ {medicine.food}
                </p>

              </div>


              <div className="medicine-actions">

                <button
                  className={
                    medicine.taken
                      ? "taken-button"
                      : "take-button"
                  }
                  onClick={() =>
                    toggleTaken(
                      medicine.id
                    )
                  }
                >
                  {
                    medicine.taken
                      ? "✓ Taken"
                      : "Take"
                  }
                </button>


                <button
                  className="delete-button"
                  onClick={() =>
                    deleteMedicine(
                      medicine.id
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


      {/* Add Medicine Button */}

      {!showForm && (

        <button
          className="add-activity-button"
          onClick={() =>
            setShowForm(true)
          }
        >
          + Add Medicine
        </button>

      )}


      {/* Form */}

      {showForm && (

        <div className="medicine-form">

          <div className="form-header">

            <h2>
              ➕ Add Medicine
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


          <form onSubmit={addMedicine}>

            <label>
              Medicine Name
            </label>

            <input
              type="text"
              placeholder="e.g. BP Medicine"
              value={newMedicine.name}
              onChange={(e) =>
                setNewMedicine({
                  ...newMedicine,
                  name: e.target.value,
                })
              }
            />


            <label>
              Dose
            </label>

            <input
              type="text"
              placeholder="e.g. 1 Tablet"
              value={newMedicine.dose}
              onChange={(e) =>
                setNewMedicine({
                  ...newMedicine,
                  dose: e.target.value,
                })
              }
            />


            <label>
              Time
            </label>

            <input
              type="time"
              value={newMedicine.time}
              onChange={(e) =>
                setNewMedicine({
                  ...newMedicine,
                  time: e.target.value,
                })
              }
            />


            <label>
              Meal Timing
            </label>

            <select
              value={newMedicine.food}
              onChange={(e) =>
                setNewMedicine({
                  ...newMedicine,
                  food: e.target.value,
                })
              }
            >
              <option>
                Before Food
              </option>

              <option>
                After Food
              </option>

              <option>
                With Food
              </option>

              <option>
                Anytime
              </option>
            </select>


            <label>
              Time of Day
            </label>

            <select
              value={newMedicine.period}
              onChange={(e) =>
                setNewMedicine({
                  ...newMedicine,
                  period: e.target.value,
                })
              }
            >
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
              <option>Night</option>
            </select>


            <button
              type="submit"
              className="save-activity-button"
            >
              Save Medicine
            </button>

          </form>

        </div>

      )}

    </div>
  );
}

export default Medicine;