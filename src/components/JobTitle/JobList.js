import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function DepartList() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    fetchJobs();

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/job");
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching job titles:", error);
    }
  };

  const filteredJobs = jobs.filter((job) =>
    job.Job_Title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedJobs = filteredJobs.slice(0, entriesToShow);

  return (
    <div className="column container mt-5">
      {/* Search & Actions */}
      <div className="is-flex is-justify-content-space-between mb-3">
        <input
          type="text"
          className="input"
          style={{ maxWidth: "300px" }}
          placeholder="Search Job Title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link to="/AddJob" className="button is-success ml-3">
          Add Job Title
        </Link>
      </div>

      {/* Table View (Desktop) */}
      {!isMobile && (
        <table className="table is-striped is-fullwidth">
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Job Title</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedJobs.map((job) => (
              <tr key={job.id}>
                <td>{job.id}</td>
                <td>{job.Job_Title}</td>
                <td>
                  <Link
                    to={`/editJobTitle/${job.id}`}
                    className="button is-small is-info mr-2"
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
          {displayedJobs.map((job) => (
            <div key={job.id} className="column is-12">
              <div className="card">
                <header className="card-header">
                  <p className="card-header-title">{job.Job_Title}</p>
                </header>
                <div className="card-content">
                  <p className="subtitle is-6"><strong>Job ID:</strong> {job.id}</p>
                </div>
                <footer className="card-footer">
                  <Link
                    to={`/editJobTitle/${job.id}`}
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
              <option value={filteredJobs.length}>All</option>
            </select>
          </div>
        </div>
        <p>
          Showing {displayedJobs.length} of {filteredJobs.length} entries
        </p>
      </div>
    </div>
  );
}

export default DepartList;