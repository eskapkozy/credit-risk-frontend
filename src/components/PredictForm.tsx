import { useState } from "react";
import { api } from "../services/api";

export default function PredictForm() {

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

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await api.post("/predict", form);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("API error");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">

      <h1 className="text-2xl font-bold">
        Credit Risk Scoring
      </h1>

      <input name="person_age" onChange={handleChange} placeholder="Age" className="input" />
      <input name="person_income" onChange={handleChange} placeholder="Income" className="input" />
      <input name="loan_amnt" onChange={handleChange} placeholder="Loan Amount" className="input" />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Predict
      </button>

      {result && (
        <div className="mt-4 p-4 border rounded">
          <p>Prediction: {result.prediction}</p>
          <p>Probability: {result.probability}</p>
          <p>Threshold: {result.threshold}</p>
        </div>
      )}

    </div>
  );
}