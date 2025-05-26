import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <Link className="navbar-brand" to="/">EduSync</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto">
          {user?.role === 'Student' && <li><Link className="nav-link" to="/courses">Courses</Link></li>}
          {user?.role === 'Instructor' && (
            <>
              <li><Link className="nav-link" to="/upload">Upload Course</Link></li>
              <li><Link className="nav-link" to="/upload-assessment">Upload Assessment</Link></li>
              <li><Link className="nav-link" to="/my-courses">My Courses</Link></li>
            </>
          )}
          {user && <li><Link className="nav-link" to="/results">Results</Link></li>}

        </ul>
        {user && <button className="btn btn-outline-danger ml-auto" onClick={logout}>Logout</button>}
      </div>
    </nav>
  );
}

export default Navbar;
