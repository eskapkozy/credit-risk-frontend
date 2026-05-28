import { useState } from "react";
import { api } from "./services/api";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    person_age: 30,
    person_income: 50000,
    person_home_ownership: "RENT",
    person_emp_length: 5,
    loan_intent: "PERSONAL",
    loan_grade: "B",
    loan_amnt: 10000,
    loan_int_rate: 10,
    loan_percent_income: 0.2,
    cb_person_default_on_file: "N",
    cb_person_cred_hist_length: 5,
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]:
        name === "person_age" ||
        name === "person_income" ||
        name === "person_emp_length" ||
        name === "loan_amnt" ||
        name === "loan_int_rate" ||
        name === "loan_percent_income" ||
        name === "cb_person_cred_hist_length"
          ? Number(value)
          : value,
    });
  };

  const getRiskLevel = (probability: number, threshold: number): "low" | "medium" | "high" => {
    if (probability < threshold * 0.5) return "low";
    if (probability < threshold) return "medium";
    return "high";
  };

  const predict = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/api/predict", form);
      setResult(res.data);
    } catch (err) {
      setError("Failed to analyze risk. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Credit Risk Engine</h1>
        <p>AI-powered credit scoring system</p>
      </div>

      <div className="main-layout">
        {/* Left Side - Input Form Card */}
        <div className="card">
          <h2>Applicant Information</h2>

          {/* Personal Info Section */}
          <div className="form-section">
            <div className="section-title">Personal Information</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="person_age"
                  value={form.person_age}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Annual Income ($)</label>
                <input
                  type="number"
                  name="person_income"
                  value={form.person_income}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Home Ownership</label>
                <select
                  name="person_home_ownership"
                  value={form.person_home_ownership}
                  onChange={handleChange}
                >
                  <option value="RENT">Rent</option>
                  <option value="OWN">Own</option>
                  <option value="MORTGAGE">Mortgage</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Employment Length (years)</label>
                <input
                  type="number"
                  name="person_emp_length"
                  value={form.person_emp_length}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Loan Info Section */}
          <div className="form-section">
            <div className="section-title">Loan Information</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Loan Amount ($)</label>
                <input
                  type="number"
                  name="loan_amnt"
                  value={form.loan_amnt}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  name="loan_int_rate"
                  value={form.loan_int_rate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Loan Intent</label>
                <select
                  name="loan_intent"
                  value={form.loan_intent}
                  onChange={handleChange}
                >
                  <option value="PERSONAL">Personal</option>
                  <option value="EDUCATION">Education</option>
                  <option value="MEDICAL">Medical</option>
                  <option value="VENTURE">Venture</option>
                  <option value="HOMEIMPROVEMENT">Home Improvement</option>
                  <option value="DEBTCONSOLIDATION">Debt Consolidation</option>
                </select>
              </div>
              <div className="form-group">
                <label>Loan Grade</label>
                <select
                  name="loan_grade"
                  value={form.loan_grade}
                  onChange={handleChange}
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                  <option value="G">G</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>Loan Percent Income</label>
                <input
                  type="number"
                  step="0.01"
                  name="loan_percent_income"
                  value={form.loan_percent_income}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Credit History Section */}
          <div className="form-section">
            <div className="section-title">Credit History</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Credit History Length (years)</label>
                <input
                  type="number"
                  name="cb_person_cred_hist_length"
                  value={form.cb_person_cred_hist_length}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Default on File</label>
                <select
                  name="cb_person_default_on_file"
                  value={form.cb_person_default_on_file}
                  onChange={handleChange}
                >
                  <option value="N">No</option>
                  <option value="Y">Yes</option>
                </select>
              </div>
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={predict}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Run Risk Analysis"}
          </button>
        </div>

        {/* Right Side - Result Card */}
        <div className="card result-card">
          <h2>Risk Assessment</h2>

          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <div className="loading-text">Analyzing risk profile...</div>
            </div>
          )}

          {error && (
            <div className="error-state">
              <div>{error}</div>
            </div>
          )}

          {!loading && !error && !result && (
            <div className="empty-state">
              No prediction yet
            </div>
          )}

          {!loading && !error && result && (
            <div className="result-content">
              <div className={`risk-badge ${getRiskLevel(result.probability, result.threshold)}`}>
                {getRiskLevel(result.probability, result.threshold).toUpperCase()} RISK
              </div>

              <div className="probability-display">
                <div className="probability-value">
                  {result.probability.toFixed(2)}
                </div>
                <div className="probability-label">Default Probability</div>
              </div>

              <div className="risk-meter">
                <div className="meter-label">Risk Level Indicator</div>
                <div className="meter-bar">
                  <div
                    className="meter-indicator"
                    style={{ left: `${result.probability * 100}%` }}
                  />
                </div>
              </div>

              <div className="threshold-display">
                <span className="threshold-label">Decision Threshold:</span>
                <span className="threshold-value">{result.threshold.toFixed(2)}</span>
              </div>

              <div className="prediction-display">
                <div className="prediction-value">
                  {result.prediction === 1 ? "Default Predicted" : "No Default Predicted"}
                </div>
                <div className="prediction-label">Model Decision</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;