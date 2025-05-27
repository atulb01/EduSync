import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';

function CourseDetails() {
  const { id } = useParams(); // courseId from route
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    API.get(`/courses/${id}`)
      .then(res => setCourse(res.data))
      .catch(err => {
        console.error("Error loading course:", err);
      });
  }, [id]);

  if (!course) return <p>Loading...</p>;

  return (
    <div className="col-md-8 offset-md-2 mt-5">
      <div className="card shadow-lg p-4 rounded-4">
        <h2 className="mb-3">{course.title}</h2>
        <p className="text-muted mb-4">{course.description}</p>

        <div className="mb-4">
          <h5>Course Material</h5>
          {course.mediaUrl ? (
            <a
              href={course.mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-primary"
            >
              View / Download Material
            </a>
          ) : (
            <p className="text-danger">No material available.</p>
          )}
        </div>

        <button
          className="btn btn-success"
          onClick={() => navigate(`/courses/${id}/quiz`)}
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}

export default CourseDetails;
