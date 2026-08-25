import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import API from "../api/api";


function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);


  const handleRegister = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");


    // =========================
    // PASSWORD CHECK
    // =========================

    if (password !== confirmPassword) {

      setError(
        "Passwords match nahi kar rahe"
      );

      return;
    }


    if (password.length < 6) {

      setError(
        "Password kam se kam 6 characters ka hona chahiye"
      );

      return;
    }


    setLoading(true);


    try {

      const response = await API.post(
        "/api/auth/register",
        {
          name: name.trim(),
          email: email.trim(),
          password: password
        }
      );


      const data = response.data;


      setSuccess(
        "Account successfully create ho gaya ❤️"
      );


      // =========================
      // TOKEN CLEAR
      // =========================

      localStorage.removeItem("token");
      localStorage.removeItem("user");


      // =========================
      // GO TO LOGIN
      // =========================

      setTimeout(() => {

        navigate("/");

      }, 1200);


    } catch (error) {

      console.error(
        "Registration error:",
        error
      );


      setError(
        error.response?.data?.detail ||
        "Registration failed. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="login-page">

      <div className="login-card">

        <div className="login-logo">
          ❤️
        </div>


        <h1>Ammaa AI</h1>


        <p className="login-welcome">
          Create Account 🌸
        </p>


        <p className="login-subtitle">
          Ammaa ke liye naya account banayein
        </p>


        <form onSubmit={handleRegister}>

          {/* NAME */}

          <label>
            Name
          </label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
          />


          {/* EMAIL */}

          <label>
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />


          {/* PASSWORD */}

          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />


          {/* CONFIRM PASSWORD */}

          <label>
            Confirm Password
          </label>

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            required
          />


          {/* ERROR */}

          {error && (

            <p
              style={{
                color: "red",
                marginTop: "10px"
              }}
            >
              {error}
            </p>

          )}


          {/* SUCCESS */}

          {success && (

            <p
              style={{
                color: "green",
                marginTop: "10px"
              }}
            >
              {success}
            </p>

          )}


          {/* REGISTER BUTTON */}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >

            {loading
              ? "Creating Account..."
              : "Register"
            }

          </button>

        </form>


        {/* LOGIN */}

        <p
          className="login-help"
          style={{
            cursor: "pointer"
          }}
          onClick={() => navigate("/")}
        >

          Already have an account?

          <br />

          <strong>
            Login karein
          </strong>

        </p>


      </div>

    </div>

  );

}


export default Register;