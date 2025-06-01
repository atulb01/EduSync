import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';

function ViewAssessments() {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    API.get('/assessments').then(res => setAssessments(res.data)).catch(console.error);
    API.get('/courses').then(res => setCourses(res.data)).catch(console.error);
  }, []);

  const instructorCourses = courses.filter(c => c.instructorId === user.userId || c.instructorId === user.id);
  const instructorCourseIds = instructorCourses.map(c => c.courseId);

  const myAssessments = assessments.filter(a => instructorCourseIds.includes(a.courseId));

  const getCourseTitle = (id) => {
    const course = courses.find(c => c.courseId === id);
    return course ? course.title : id;
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Uploaded Assessments</h2>
      {myAssessments.length === 0 ? (
        <p className="text-muted">No assessments found.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Title</th>
              <th>Course</th>
              <th>Max Score</th>
            </tr>
          </thead>
          <tbody>
            {myAssessments.map(a => (
              <tr key={a.assessmentId}>
                <td>{a.title}</td>
                <td>{getCourseTitle(a.courseId)}</td>
                <td>{a.maxScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ViewAssessments;
