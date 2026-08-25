import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import API from "../api/api";

function HealthProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "Ammaa",
    age: "",
    gender: "Female",
    height: "",
    weight: "",
    bloodGroup: "",
    allergies: "",
    medicalHistory: "",
    emergencyName: "",
    emergencyPhone: "",
    doctorName: "",
    doctorPhone: "",
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // =========================
  // LOAD PROFILE
  // =========================

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get("/api/profile/");

      console.log("Profile response:", response.data);

      if (response.data.success && response.data.profile) {
        const data = response.data.profile;

        setProfile({
          name: data.name || "Ammaa",
          age: data.age ?? "",
          gender: data.gender || "Female",
          height: data.height ?? "",
          weight: data.weight ?? "",
          bloodGroup: data.bloodGroup || "",
          allergies: data.allergies || "",
          medicalHistory: data.medicalHistory || "",
          emergencyName: data.emergencyName || "",
          emergencyPhone: data.emergencyPhone || "",
          doctorName: data.doctorName || "",
          doctorPhone: data.doctorPhone || "",
        });
      }

    } catch (error) {
      console.error("Profile fetch error:", error);
    } finally {
      setFetching(false);
    }
  };


  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });

    setSaved(false);
  };


  // =========================
  // SAVE PROFILE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSaved(false);

    try {
      const response = await API.post(
        "/api/profile/",
        {
          ...profile,

          // Convert number inputs
          age: profile.age === "" ? null : Number(profile.age),
          height: profile.height === "" ? null : Number(profile.height),
          weight: profile.weight === "" ? null : Number(profile.weight),
        }
      );

      console.log("Profile saved:", response.data);

      if (response.data.success) {
        setSaved(true);

      if (response.data.profile) {
        const data = response.data.profile;

        setProfile({
          name: data.name || "Ammaa",
          age: data.age ?? "",
          gender: data.gender || "Female",
          height: data.height ?? "",
          weight: data.weight ?? "",
          bloodGroup: data.bloodGroup || "",
          allergies: data.allergies || "",
          medicalHistory: data.medicalHistory || "",
          emergencyName: data.emergencyName || "",
          emergencyPhone: data.emergencyPhone || "",
          doctorName: data.doctorName || "",
          doctorPhone: data.doctorPhone || "",
        });
      }
    }
    } catch (error) {
      console.error("Profile save error:", error);

      alert(
        error.response?.data?.detail ||
        "Profile save nahi ho paaya. Backend check karo."
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="health-page">

      {/* Header */}

      <div className="page-header">

        <button
          className="back-button"
          onClick={() => navigate("/home")}
        >
          ←
        </button>

        <div>
          <h1>🩺 Health Profile</h1>
          <p>Ammaa ki health information</p>
        </div>

      </div>


      {/* Loading */}

      {fetching && (
        <div className="saved-message">
          Loading profile...
        </div>
      )}


      {/* Profile Header */}

      <div className="health-profile-card">

        <div className="health-avatar">
          👩
        </div>

        <div>
          <h2>{profile.name || "Ammaa"}</h2>
          <p>Health Profile</p>
        </div>

      </div>


      <form onSubmit={handleSubmit}>

        {/* =========================
            BASIC INFORMATION
        ========================== */}

        <div className="health-section">

          <h2>👤 Basic Information</h2>

          <label>Name</label>

          <input
            name="name"
            type="text"
            value={profile.name}
            onChange={handleChange}
            placeholder="Name"
          />


          <div className="two-inputs">

            <div>
              <label>Age</label>

              <input
                name="age"
                type="number"
                value={profile.age}
                onChange={handleChange}
                placeholder="Age"
              />
            </div>


            <div>
              <label>Gender</label>

              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

          </div>


          <div className="two-inputs">

            <div>
              <label>Height (cm)</label>

              <input
                name="height"
                type="number"
                value={profile.height}
                onChange={handleChange}
                placeholder="Height"
              />
            </div>


            <div>
              <label>Weight (kg)</label>

              <input
                name="weight"
                type="number"
                value={profile.weight}
                onChange={handleChange}
                placeholder="Weight"
              />
            </div>

          </div>


          <label>Blood Group</label>

          <select
            name="bloodGroup"
            value={profile.bloodGroup}
            onChange={handleChange}
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>

        </div>


        {/* =========================
            MEDICAL INFORMATION
        ========================== */}

        <div className="health-section">

          <h2>🏥 Medical Information</h2>

          <label>Allergies</label>

          <textarea
            name="allergies"
            value={profile.allergies}
            onChange={handleChange}
            placeholder="e.g. Dust allergy, medicine allergy..."
          />


          <label>Medical History</label>

          <textarea
            name="medicalHistory"
            value={profile.medicalHistory}
            onChange={handleChange}
            placeholder="Important medical history..."
          />

        </div>


        {/* =========================
            EMERGENCY CONTACT
        ========================== */}

        <div className="health-section">

          <h2>🚨 Emergency Contact</h2>

          <label>Contact Name</label>

          <input
            name="emergencyName"
            type="text"
            value={profile.emergencyName}
            onChange={handleChange}
            placeholder="Emergency contact name"
          />


          <label>Phone Number</label>

          <input
            name="emergencyPhone"
            type="tel"
            value={profile.emergencyPhone}
            onChange={handleChange}
            placeholder="Emergency phone number"
          />

        </div>


        {/* =========================
            DOCTOR
        ========================== */}

        <div className="health-section">

          <h2>👨‍⚕️ Doctor Details</h2>

          <label>Doctor Name</label>

          <input
            name="doctorName"
            type="text"
            value={profile.doctorName}
            onChange={handleChange}
            placeholder="Doctor name"
          />


          <label>Doctor Phone</label>

          <input
            name="doctorPhone"
            type="tel"
            value={profile.doctorPhone}
            onChange={handleChange}
            placeholder="Doctor phone number"
          />

        </div>


        {/* =========================
            SAVE
        ========================== */}

        <button
          type="submit"
          className="save-health-button"
          disabled={loading}
        >
          {loading
            ? "⏳ Saving..."
            : "💾 Save Health Profile"}
        </button>


        {saved && (
          <div className="saved-message">
            ✓ Health profile saved successfully
          </div>
        )}

      </form>

    </div>
  );
}

export default HealthProfile;