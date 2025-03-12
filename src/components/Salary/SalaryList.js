import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { pdf } from "@react-pdf/renderer";
import SalaryPDF from "../Printing/SalaryPDF";

function SalaryList() {
  const [salaries, setSalary] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    getUsers();

    // Handle screen resizing
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/salary");
      setSalary(response.data);
    } catch (error) {
      console.error("Error fetching salaries:", error);
    }
  };

  const filteredSalaries = salaries.filter((user) =>
    `${user.Job_Title} ${user.position}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const displayedSalaries = filteredSalaries.slice(0, entriesToShow);

  // Generate and open PDF
  const handleViewPDF = async () => {
    const blob = await pdf(<SalaryPDF salaries={salaries} />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  return (
    <div className="column container mt-5">
      {/* Search & Actions */}
      <div className="is-flex is-justify-content-space-between mb-3">
        <input
          type="text"
          className="input"
          style={{ maxWidth: "300px" }}
          placeholder="Search by Job Title or Position..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          <Link to="/AddSalary" className="button is-success">
            Add Position
          </Link>
          <button onClick={handleViewPDF} className="button is-info ml-3">
            View PDF
          </button>
        </div>
      </div>

      {/* Table View (Desktop) */}
      {!isMobile && (
        <table className="table is-striped is-fullwidth">
          <thead>
            <tr>
              <th>Salary ID</th>
              <th>Job Title</th>
              <th>Position / Level</th>
              <th>Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedSalaries.map((user) => (
              <tr key={user.id}>
                <td className="">{user.id}</td>
                <td>{user.Job_Title}</td>
                <td>{user.position}</td>
                <td>
                  {user.salary
                    ? `₱${parseFloat(user.salary).toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}`
                    : "N/A"}
                </td>
                <td>
                  <Link
                    to={`/editSalary/${user.id}`}
                    className="button is-small is-info"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Card View (Mobile) */}
      {isMobile && (
        <div className="columns is-multiline">
          {displayedSalaries.map((user) => (
            <div key={user.id} className="column is-12">
              <div className="card">
                <header className="card-header">
                  <p className="card-header-title">{user.Job_Title}</p>
                </header>
                <div className="card-content">
                  <p className="subtitle is-6">
                    <strong>Salary ID:</strong> {user.id}
                  </p>
                  <p className="subtitle is-6">
                    <strong>Position:</strong> {user.position}
                  </p>
                  <p className="subtitle is-6">
                    <strong>Salary:</strong>{" "}
                    {user.salary
                      ? `₱${parseFloat(user.salary).toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}`
                      : "N/A"}
                  </p>
                </div>
                <footer className="card-footer">
                  <Link
                    to={`/editSalary/${user.id}`}
                    className="card-footer-item button is-small is-info"
                  >
                    Edit
                  </Link>
                </footer>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer - Entry Controls */}
      <div className="is-flex is-align-items-center is-justify-content-space-between mt-3">
        <div>
          <label className="mr-2">Show entries:</label>
          <div className="select">
            <select
              value={entriesToShow}
              onChange={(e) => setEntriesToShow(Number(e.target.value))}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value={filteredSalaries.length}>All</option>
            </select>
          </div>
        </div>
        <p>
          Showing {displayedSalaries.length} of {filteredSalaries.length}{" "}
          entries
        </p>
      </div>
    </div>
  );
}

export default SalaryList;
