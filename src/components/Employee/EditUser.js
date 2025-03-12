import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [positions, setPositions] = useState([]);
  const [position_id, setPositionId] = useState("");
  const [salary, setSalary] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const [departments, setDepartments] = useState([]);
  const [dep_id, selectDeptID] = useState("");

  useEffect(() => {
    const selectedPosition = positions.find(
      (pos) => String(pos.id) === String(position_id)
    );
    setSalary(selectedPosition ? selectedPosition.salary : "");
  }, [position_id, positions]);

  useEffect(() => {
    const getUserById = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${id}`);
        console.log("Full API Response:", response.data.full_name);
        setName(response.data.full_name);
        setEmail(response.data.email);
        setGender(response.data.gender);
        selectDeptID(response.data.job_id);
        setPositionId(response.data.salary_id);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    getUserById();
  }, [id]);

  // Fetch Positions when Department Changes
  useEffect(() => {
    if (!dep_id) {
      setPositions([]);
      setPositionId("");
      setSalary("");
      return;
    }

    const fetchPositions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/salary/getPosition/${dep_id}`
        );
        setPositions(response.data);
      } catch (error) {
        console.error("Error fetching positions:", error);
      }
    };

    fetchPositions();
  }, [dep_id]);

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

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/users/${id}`, {
        name,
        email,
        gender,
        position_id,
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="column is-half container mt-5">
        <form onSubmit={updateUser}>
          <div className="field">
            <label className="label">Name</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Email</label>
            <div className="control">
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Gender</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
          </div>
          {/* // ----------------------------------------------------------- */}
          <div className="field">
            <label className="label">Job Title</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select
                  value={dep_id}
                  onChange={(e) => selectDeptID(e.target.value)}
                >
                  {departments.map((dep) => (
                    <option key={dep.id} value={dep.id}>
                      {dep.Job_Title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Position */}
          <div className="field">
            <label className="label">Position</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select
                  value={position_id}
                  onChange={(e) => setPositionId(e.target.value)}
                  required
                >
                  <option value="">Select a position</option>
                  {positions.map((pos) => (
                    <option key={pos.id} value={pos.id}>
                      {pos.position}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Salary */}
          <div className="field">
            <label className="label">Salary</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={
                  salary
                    ? `₱${parseFloat(salary).toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}`
                    : ""
                }
                disabled
              />
            </div>
          </div>
          <div className="field">
            <button type="submit" className="button is-success">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
