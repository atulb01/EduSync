import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/api';

function CourseList() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    API.get('/courses')
      .then(response => setCourses(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 fw-bold">Available Courses</h2>

      {courses.length === 0 ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2">Loading courses...</p>
        </div>
      ) : (
        <div className="row">
          {courses.map(course => (
            <div key={course.courseId} className="col-md-6 col-lg-4 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text text-muted">{course.description}</p>
                  <div className="mt-auto">
                    <Link to={`/courses/${course.courseId}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CourseList;
