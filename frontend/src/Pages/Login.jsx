import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import API from "../api/api";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");

    // Basic validation
    if (!email.trim()) {
      setError("Email enter karein");
      return;
    }

    if (!password.trim()) {
      setError("Password enter karein");
      return;
    }

    setLoading(true);

    try {

      const response = await API.post(
        "/api/auth/login",
        {
          email: email.trim(),
          password: password
        }
      );

      const data = response.data;

      console.log("Login response:", data);

      // Save token
      localStorage.setItem(
        "token",
        data.token
      );

      // Save user
      localStorage.setItem(
        "user",
        JSON.stringify({
          user_id: data.user_id,
          name: data.name
        })
      );

      // Home
      navigate("/home");

    } catch (error) {

      console.error(
        "Login error:",
        error.response?.data || error
      );

      // FastAPI validation error
      if (error.response?.status === 422) {

        const detail = error.response?.data?.detail;

        if (Array.isArray(detail)) {

          setError(
            detail[0]?.msg ||
            "Please enter valid email and password"
          );

        } else {

          setError(
            "Please enter a valid email address"
          );

        }

      }

      // Wrong credentials
      else if (error.response?.status === 401) {

        setError(
          "Invalid email or password"
        );

      }

      // Other error
      else {

        setError(
          error.response?.data?.detail ||
          "Login failed. Please try again."
        );

      }

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
          Welcome Amma 🌸
        </p>

        <p className="login-subtitle">
          Aapka personal health & daily assistant
        </p>


        <form onSubmit={handleLogin}>

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


          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />


          {error && (

            <p
              style={{
                color: "red",
                marginTop: "10px",
                marginBottom: "10px"
              }}
            >
              {error}
            </p>

          )}


          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"
            }

          </button>

        </form>


        <p className="login-help">
          ❤️ Aapka khayal rakhna hamari priority hai.
        </p>


        <p
          className="login-help"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/register")}
        >
          New user?
          <br />

          <strong>
            Create an account
          </strong>

        </p>

      </div>

    </div>

  );
}

export default Login;