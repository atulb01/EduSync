import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-4">
      <Link className="navbar-brand fw-bold" to="/">EduSync</Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          {user && (
            <li className="nav-item">
              <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
            </li>
          )}
          {user?.role === 'Student' && (
            <li className="nav-item">
              <NavLink className="nav-link" to="/courses">Courses</NavLink>
            </li>
          )}

          {user?.role === 'Instructor' && (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/upload">Upload Course</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/upload-assessment">Upload Assessment</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/my-courses">My Courses</NavLink>
              </li>
            </>
          )}

          {user && (
            <li className="nav-item">
              <NavLink className="nav-link" to="/results">Results</NavLink>
            </li>
          )}
        </ul>

        <div className="d-flex">
          {user ? (
            <button className="btn btn-outline-danger" onClick={logout}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="btn btn-outline-primary">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
