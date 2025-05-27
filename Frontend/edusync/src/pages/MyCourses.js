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
      const assessmentRes = await API.get(`/assessments/bycourse/${courseId}`);
      const assessment = assessmentRes.data;

      if (assessment?.assessmentId) {
        const resultsRes = await API.get('/results');
        const relatedResults = resultsRes.data.filter(
          r => r.assessmentId === assessment.assessmentId
        );

        await Promise.all(
          relatedResults.map(r => API.delete(`/results/${r.resultId}`))
        );

        await API.delete(`/assessments/${assessment.assessmentId}`);
      }

      await API.delete(`/courses/${courseId}`);
      setCourses(courses.filter(c => c.courseId !== courseId));
      setMessage('Course, assessment, and related results deleted.');
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
      setMessage('Failed to delete course and related data.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold">My Uploaded Courses</h2>
        {message && <div className="alert alert-info mt-3">{message}</div>}
      </div>

      {courses.length === 0 ? (
        <div className="text-center">
          <p className="text-muted">You haven’t uploaded any courses yet.</p>
        </div>
      ) : (
        <div className="row">
          {courses.map(course => (
            <div key={course.courseId} className="col-md-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text text-muted">{course.description}</p>
                  <div className="mt-auto text-end">
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => deleteCourse(course.courseId)}
                    >
                      Delete Course
                    </button>
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

export default MyCourses;
