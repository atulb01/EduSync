import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';

function MyCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    API.get('/courses')
      .then(res => {
        const instructorCourses = res.data.filter(
          course => course.instructorId === user.userId || course.instructorId === user.id
        );
        setCourses(instructorCourses);
      })
      .catch(console.error);
  }, [user]);

    const deleteCourse = async (courseId) => {
    try {
        // 1. Get the assessment for this course
        const assessmentRes = await API.get(`/assessments/bycourse/${courseId}`);
        const assessment = assessmentRes.data;

        // 2. If assessment exists, delete its results first
        if (assessment?.assessmentId) {
        const resultsRes = await API.get('/results'); // Get all results
        const relatedResults = resultsRes.data.filter(
            r => r.assessmentId === assessment.assessmentId
        );

        // Delete all related results
        await Promise.all(
            relatedResults.map(r => API.delete(`/results/${r.resultId}`))
        );

        // 3. Now delete the assessment
        await API.delete(`/assessments/${assessment.assessmentId}`);
        }

        // 4. Now delete the course
        await API.delete(`/courses/${courseId}`);

        // 5. Update state and show message
        setCourses(courses.filter(c => c.courseId !== courseId));
        setMessage('Course, assessment, and related results deleted.');
    } catch (err) {
        console.error("Delete failed:", err.response?.data || err.message);
        setMessage('Failed to delete course and related data.');
    }
    };


  return (
    <div className="col-md-10 offset-md-1 mt-4">
      <h2>My Uploaded Courses</h2>
      {message && <div className="alert alert-info">{message}</div>}
      {courses.length === 0 ? (
        <p>No courses uploaded yet.</p>
      ) : (
        <ul className="list-group">
          {courses.map(course => (
            <li key={course.courseId} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5>{course.title}</h5>
                <p>{course.description}</p>
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => deleteCourse(course.courseId)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyCourses;
