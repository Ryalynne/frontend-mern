import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isActive, setIsActive] = useState(false); // For mobile menu toggle

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <nav className={`navbar ${isDarkMode ? "is-dark" : "is-light"}`} role="navigation" aria-label="main navigation">
      <div className="container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-item">
            <h1 className={`title is-4 ${isDarkMode ? "has-text-white" : "has-text-black"}`}>MERN</h1>
          </Link>

          {/* Mobile menu toggle button */}
          <button 
            className={`navbar-burger ${isActive ? "is-active" : ""}`}
            aria-label="menu"
            aria-expanded="false"
            onClick={() => setIsActive(!isActive)}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>

        <div className={`navbar-menu ${isActive ? "is-active" : ""}`}>
          <div className="navbar-start">
            <NavLink to="/JobTitleList" className={({ isActive }) => isActive ? "navbar-item is-active" : "navbar-item"}>
              Job Title
            </NavLink>
            <NavLink to="/SalaryList" className={({ isActive }) => isActive ? "navbar-item is-active" : "navbar-item"}>
              Job Position
            </NavLink>
            <NavLink to="/" className={({ isActive }) => isActive ? "navbar-item is-active" : "navbar-item"}>
              Employee
            </NavLink>
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <button className="button is-small is-primary is-light" onClick={toggleTheme}>
                {isDarkMode ? " Light Mode" : " Dark Mode"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
