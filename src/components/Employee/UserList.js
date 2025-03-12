import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { pdf } from "@react-pdf/renderer";
import EmployePDF from "../Printing/EmployeePDF";
import ConfirmBox from "../UI/Modal/ConfirmBox";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [deleteData, setDeleteData] = useState(null);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    getUsers();
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const filteredUsers = users.filter((user) =>
    `${user.full_name} ${user.email} ${user.Job_Title} ${user.position} ${user.id}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const displayedUsers = filteredUsers.slice(0, entriesToShow);

  const openDelete = (user) => {
    setDeleteData(user);
    setOpen(true);
  };

  const deleteUser = async () => {
    if (!deleteData) return;
    try {
      await axios.delete(`http://localhost:5000/users/${deleteData.id}`);
      setDeleteData(null);
      setOpen(false);
      getUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleViewPDF = async () => {
    const blob = await pdf(<EmployePDF users={users} />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  return (
    <div className="container mt-5">
      {!isMobile ? (
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
            <Link to="/AddEmployee" className="button is-success mr-2">
              Add Job Title
            </Link>
            <button onClick={handleViewPDF} className="button is-info ml-3">
              View PDF
            </button>
          </div>
        </div>
      ) : (
        <div className="is-flex is-justify-content-space-between mb-3 mr-4">
          <input
            type="text"
            className="input"
            style={{ maxWidth: "300px" }}
            placeholder="Search by Job Title or Position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div>
            <Link to="/AddEmployee" className="button is-success mr-2">
              Add Job Title
            </Link>
            <button onClick={handleViewPDF} className="button is-info ml-3">
              View PDF
            </button>
          </div>
        </div>
      )}
      {/* Top Controls */}

      {/* Table View for Desktop */}
      {!isMobile ? (
        <div className="table-container">
          <table className="table is-striped is-fullwidth">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Job Title</th>
                <th>Position</th>
                <th>Salary</th>
                <th>Annual Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.length > 0 ? (
                displayedUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>{user.Job_Title}</td>
                    <td>{user.position}</td>
                    <td>₱{user.salary?.toLocaleString("en-PH") || "-"}</td>
                    <td>
                      ₱{user.anual_salary?.toLocaleString("en-PH") || "-"}
                    </td>
                    <td>
                      <Link
                        to={`edit/${user.id}`}
                        className="button is-small is-info mr-2"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => openDelete(user)}
                        className="button is-small is-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="has-text-centered">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Mobile View */
        <div className="columns is-multiline m-1">
          {displayedUsers.map((user) => (
            <div key={user.id} className="column is-12">
              <div className="card">
                <header className="card-header">
                  <p className="card-header-title">{user.full_name}</p>
                </header>
                <div className="card-content">
                  <p>
                    <strong>Employee ID:</strong> {user.id}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Job Title:</strong> {user.Job_Title}
                  </p>
                  <p>
                    <strong>Position:</strong> {user.position}
                  </p>
                  <p>
                    <strong>Salary:</strong> ₱
                    {user.salary?.toLocaleString("en-PH") || "-"}
                  </p>
                  <p>
                    <strong>Annual Salary:</strong> ₱
                    {user.anual_salary?.toLocaleString("en-PH") || "-"}
                  </p>
                </div>
                <footer className="card-footer">
                  <Link
                    to={`edit/${user.id}`}
                    className="card-footer-item button is-small is-info"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => openDelete(user)}
                    className="card-footer-item button is-small is-danger"
                  >
                    Delete
                  </button>
                </footer>
              </div>
            </div>
          ))}
        </div>
      )}
      {!isMobile ? (
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
                <option value={filteredUsers.length}>All</option>
              </select>
            </div>
          </div>
          <p>
            Showing {displayedUsers.length} of {filteredUsers.length} entries
          </p>
        </div>
      ) : (
        <div className="is-flex is-align-items-center is-justify-content-space-between m-5">
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
                <option value={filteredUsers.length}>All</option>
              </select>
            </div>
          </div>
          <p>
            Showing {displayedUsers.length} of {filteredUsers.length} entries
          </p>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmBox
        open={open}
        closeDialog={() => setOpen(false)}
        title={`${deleteData?.full_name}`}
        empID={`${deleteData?.id}`}
        deleteFunction={deleteUser}
      />
    </div>
  );
};

export default UserList;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { PDFDownloadLink } from "@react-pdf/renderer";
// import EmployePDF from "../Printing/EmployeePDF"; // ✅ Import the PDF component

// const UserList = () => {
//   const [users, setUser] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [entriesToShow, setEntriesToShow] = useState(10);

//   useEffect(() => {
//     getUsers();
//   }, []);

//   const getUsers = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/users");
//       setUser(response.data);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   const deleteUser = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/users/${id}`);
//       getUsers();
//     } catch (error) {
//       console.error("Error deleting user:", error);
//     }
//   };

//   // Filter users based on search term
//   const filteredUsers = users.filter((user) =>
//     `${user.full_name} ${user.email} ${user.Job_Title} ${user.position} ${user.id}`
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase())
//   );

//   // Limit displayed entries based on selection
//   const displayedUsers = filteredUsers.slice(0, entriesToShow);

//   return (
//     <div className="container mt-5">
//       {/* Search Bar and Action Buttons */}
//       <div className="is-flex is-justify-content-space-between mb-3">
//         <input
//           type="text"
//           className="input"
//           style={{ maxWidth: "300px" }}
//           placeholder="Search by Employee ID, Name, Email, Job Title, or Position..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <div>
//           <Link to="AddEmployee" className="button is-success mr-2">
//             Add Employee
//           </Link>

//           <PDFDownloadLink
//             document={<EmployePDF users={users} />}
//             fileName="Employee_Report.pdf"
//             className="button is-info mr-3"
//           >
//             {({ loading }) => (loading ? "Generating PDF..." : "Export PDF")}
//           </PDFDownloadLink>
//         </div>
//       </div>

//       {/* Employee Table */}
//       <table className="table is-striped is-fullwidth">
//         <thead>
//           <tr>
//             <th>Employee ID</th>
//             <th>Full Name</th>
//             <th>Email</th>
//             <th>Gender</th>
//             <th>Job Title</th>
//             <th>Position / Level</th>
//             <th>Salary</th>
//             <th>Annual Salary</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {displayedUsers.length > 0 ? (
//             displayedUsers.map((user) => (
//               <tr key={user.id}>
//                 <td>{user.id}</td>
//                 <td>{user.full_name}</td>
//                 <td>{user.email}</td>
//                 <td>{user.gender}</td>
//                 <td>{user.Job_Title}</td>
//                 <td>{user.position}</td>
//                 <td>
//                   {user.salary
//                     ? `₱${parseFloat(user.salary).toLocaleString("en-PH", {
//                         minimumFractionDigits: 2,
//                       })}`
//                     : ""}
//                 </td>
//                 <td>
//                   {user.anual_salary
//                     ? `₱${parseFloat(user.anual_salary).toLocaleString(
//                         "en-PH",
//                         {
//                           minimumFractionDigits: 2,
//                         }
//                       )}`
//                     : ""}
//                 </td>
//                 <td>
//                   <Link
//                     to={`edit/${user.id}`}
//                     className="button is-small is-info mr-2"
//                   >
//                     Edit
//                   </Link>
//                   <button
//                     onClick={() => deleteUser(user.id)}
//                     className="button is-small is-danger"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="9" className="has-text-centered">
//                 No users found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Footer with Entry Filter */}
//       <div className="is-flex is-align-items-center is-justify-content-space-between mt-3">
//         <div>
//           <label className="mr-2">Show entries:</label>
//           <div className="select">
//             <select
//               value={entriesToShow}
//               onChange={(e) => setEntriesToShow(Number(e.target.value))}
//             >
//               <option value="5">5</option>
//               <option value="10">10</option>
//               <option value="20">20</option>
//               <option value={filteredUsers.length}>All</option>
//             </select>
//           </div>
//         </div>
//         <p>
//           Showing {displayedUsers.length} of {filteredUsers.length} entries
//         </p>
//       </div>
//     </div>
//   );
// };

// export default UserList;
