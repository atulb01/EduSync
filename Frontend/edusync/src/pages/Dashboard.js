import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    API.get('/courses').then(res => setCourses(res.data)).catch(console.error);
    API.get('/assessments').then(res => setAssessments(res.data)).catch(console.error);
    API.get('/results').then(res => setResults(res.data)).catch(console.error);
  }, []);

  const instructorCourses = courses.filter(c => c.instructorId === user.userId || c.instructorId === user.id);
  const instructorAssessments = assessments.filter(a => instructorCourses.some(c => c.courseId === a.courseId));

  const studentResults = results.filter(r => r.userId === user.userId || r.userId === user.id);
  const avgScore = studentResults.length > 0
    ? ((studentResults.reduce((sum, r) => sum + r.score, 0) / studentResults.length).toFixed(2))*100
    : 0;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 fw-bold">Welcome, {user.name}</h2>

      {user.role === 'Instructor' ? (
        <div className="row text-center">
          <DashboardCard title="Courses Uploaded" count={instructorCourses.length} link="/my-courses" />
          <DashboardCard title="Assessments Created" count={instructorAssessments.length} link="/view-assessments" />
          <DashboardCard title="Students Assessed" count={new Set(results.map(r => r.userId)).size} link="/results" />
        </div>
      ) : (
        <div className="row text-center">
          <DashboardCard title="Available Courses" count={courses.length} link="/courses" />
          <DashboardCard title="Quizzes Taken" count={studentResults.length} link="/results" />
          <DashboardCard title="Average Score" count={`${avgScore}%`} link="/results" />
        </div>
      )}
    </div>
  );
}

function DashboardCard({ title, count, link }) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card shadow-sm p-4 rounded-4">
        <h5 className="mb-2">{title}</h5>
        <h3 className="text-primary fw-bold">{count}</h3>
        <Link to={link} className="btn btn-sm btn-outline-primary mt-2">View</Link>
      </div>
    </div>
  );
}

export default Dashboard;
