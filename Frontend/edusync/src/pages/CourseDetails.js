import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';
import { FaFileDownload, FaPlay } from 'react-icons/fa';

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    API.get(`/courses/${id}`)
      .then(res => setCourse(res.data))
      .catch(err => {
        console.error("Error loading course:", err);
      });
  }, [id]);

  if (!course) return <div className="text-center mt-5">Loading course details...</div>;

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow p-4 rounded-4">
        <h2 className="text-primary mb-3">{course.title}</h2>
        <p className="text-secondary">{course.description}</p>

        <div className="mt-4">
          <h5 className="mb-2">📘 Course Material</h5>
          {course.mediaUrl ? (
            <a
              href={course.mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-primary"
            >
              <FaFileDownload className="me-2" />
              View / Download Material
            </a>
          ) : (
            <p className="text-danger">No material available.</p>
          )}
        </div>

        <div className="mt-4 d-grid">
          <button
            className="btn btn-success btn-lg"
            onClick={() => navigate(`/courses/${id}/quiz`)}
          >
            <FaPlay className="me-2" />
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
