import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    API.get(`/courses/${id}`).then(res => setCourse(res.data)).catch(console.error);
  }, [id]);

  if (!course) return <p>Loading...</p>;

  return (
    <div>
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      {course.mediaUrl && (
        <a href={course.mediaUrl} target="_blank" rel="noreferrer">Course Material</a>
      )}
      <br />
      <button className="btn btn-success mt-3" onClick={() => navigate(`/courses/${id}/quiz`)}>
        Start Quiz
      </button>
    </div>
  );
}

export default CourseDetails;
