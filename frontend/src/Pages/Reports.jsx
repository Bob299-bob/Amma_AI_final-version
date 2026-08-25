import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../index.css";

function Reports() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [query, setQuery] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Please sirf PDF file upload karein.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError("");
    setAnalysis("");
  };

  const analyzeReport = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please pehle medical report PDF select karein.");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis("");

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append(
        "query",
        query.trim() ||
          "Explore the whole report and identify important abnormal findings."
      );

      const response = await API.post(
        "/api/reports/analyze",
        formData
      );

      setAnalysis(response.data.analysis);

    } catch (error) {
      console.error("Report analysis error:", error);

      if (error.response) {
        setError(
          error.response.data?.detail ||
            "Report analyze nahi ho paayi."
        );
      } else {
        setError(
          "Backend se connection nahi ho pa raha hai."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reports-page">

      {/* Header */}

      <div className="page-header">

        <button
          className="back-button"
          onClick={() => navigate("/home")}
        >
          ←
        </button>

        <div>
          <h1>🩺 Medical Reports</h1>
          <p>Ammaa ki reports samjhein ❤️</p>
        </div>

      </div>


      {/* Upload Card */}

      <div className="report-upload-card">

        <div className="report-upload-icon">
          📄
        </div>

        <h2>Medical Report Upload Karein</h2>

        <p>
          PDF report upload karke Ammaa AI se
          report samjhein.
        </p>

        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
        />

        {file && (
          <div className="selected-file">
            📄 {file.name}
          </div>
        )}

      </div>


      {/* Question */}

      <div className="report-question-card">

        <label>
          Report ke baare mein kya jaana hai?
        </label>

        <textarea
          placeholder="Example: Is report mein koi serious problem hai?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          className="analyze-report-button"
          onClick={analyzeReport}
          disabled={loading}
        >
          {loading
            ? "🔄 Report Analyze Ho Rahi Hai..."
            : "🧠 Analyze Report"}
        </button>

      </div>


      {/* Error */}

      {error && (
        <div className="report-error">
          ⚠️ {error}
        </div>
      )}


      {/* Loading */}

      {loading && (
        <div className="report-loading">
          <div>🧠</div>

          <h3>Ammaa AI report padh raha hai...</h3>

          <p>
            Report ke important findings identify
            kiye ja rahe hain ❤️
          </p>
        </div>
      )}


      {/* Analysis */}

      {analysis && (
        <div className="report-analysis">

          <div className="analysis-header">
            <h2>🩺 Report Analysis</h2>
          </div>

          <div className="analysis-content">
            {analysis.split("\n").map((line, index) => {

              if (line.startsWith("##")) {
                return (
                  <h3 key={index}>
                    {line.replace(/^##\s*/, "")}
                  </h3>
                );
              }

              if (line.trim() === "") {
                return <br key={index} />;
              }

              return (
                <p key={index}>
                  {line}
                </p>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}

export default Reports;