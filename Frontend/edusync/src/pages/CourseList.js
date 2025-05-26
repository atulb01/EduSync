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
    <div>
      <h2>Available Courses</h2>
      {courses.length === 0 ? (
        <p>Loading courses...</p>
      ) : (
        <ul className="list-group">
          {courses.map(course => (
            <li key={course.courseId} className="list-group-item">
              <h5>{course.title}</h5>
              <p>{course.description}</p>
              <Link to={`/courses/${course.courseId}`} className="btn btn-primary">
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CourseList;
