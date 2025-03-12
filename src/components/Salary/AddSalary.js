import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddSalary() {
  const [Position, setPosition] = useState("");
  const [Salary, setSalary] = useState("");
  const [dep_id, setDepId] = useState("");
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  const saveSalary = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/salary", {
        dep_id,
        Position,
        Salary,
      });
      navigate("/SalaryList");
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch Departments on Mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/job");
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  return (
    <div>
      <div className="column is-half container mt-5">
        <form onSubmit={saveSalary}>
          {/* Department */}
          <div className="field">
            <label className="label">Job Title</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select
                  value={dep_id}
                  onChange={(e) => setDepId(e.target.value)}
                  required
                >
                  <option value="">Select a Job</option>
                  {departments.map((dep) => (
                    <option key={dep.id} value={dep.id}>
                      {dep.Job_Title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="field">
            <label className="label">Position / Level</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={Position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Position / Level"
                required
              />
            </div>
          </div>
          {/* Salary */}
          <div className="field">
            <label className="label">Salary</label>
            <div className="control">
              <input
                type="number"
                className="input"
                value={Salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="Salary"
                required
              />
            </div>
          </div>
          {/* Submit Button */}
          <div className="field">
            <button type="submit" className="button is-success">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSalary;
