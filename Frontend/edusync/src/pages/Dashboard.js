import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaBook, FaFileAlt, FaUserGraduate, FaCheckCircle, FaClipboardList, FaChartLine } from 'react-icons/fa';

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
  const instructorAssessments = assessments.filter(a =>
    instructorCourses.some(c => c.courseId === a.courseId)
  );

  const studentResults = results.filter(r => r.userId === user.userId || r.userId === user.id);
  const avgScore =
    studentResults.length > 0
      ? ((studentResults.reduce((sum, r) => sum + r.score, 0) / studentResults.length).toFixed(2)) * 1
      : 0;

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5 fw-bold">Welcome, {user.name}</h2>

      <div className="row g-4">
        {user.role === 'Instructor' ? (
          <>
            <DashboardCard
              title="Courses Uploaded"
              count={instructorCourses.length}
              icon={<FaBook size={28} className="text-primary" />}
              link="/my-courses"
            />
            <DashboardCard
              title="Assessments Created"
              count={instructorAssessments.length}
              icon={<FaFileAlt size={28} className="text-success" />}
              link="/view-assessments"
            />
            <DashboardCard
              title="Students Assessed"
              count={new Set(results.map(r => r.userId)).size}
              icon={<FaUserGraduate size={28} className="text-info" />}
              link="/results"
            />
          </>
        ) : (
          <>
            <DashboardCard
              title="Available Courses"
              count={courses.length}
              icon={<FaBook size={28} className="text-primary" />}
              link="/courses"
            />
            <DashboardCard
              title="Quizzes Taken"
              count={studentResults.length}
              icon={<FaClipboardList size={28} className="text-warning" />}
              link="/results"
            />
            <DashboardCard
              title="Average Score"
              count={`${avgScore}%`}
              icon={<FaChartLine size={28} className="text-success" />}
              link="/results"
            />
          </>
        )}
      </div>
    </div>
  );
}

function DashboardCard({ title, count, link, icon }) {
  return (
    <div className="col-md-4">
      <div className="card h-100 shadow-sm p-4 rounded-4 text-center">
        <div className="mb-3">{icon}</div>
        <h5 className="fw-bold mb-1">{title}</h5>
        <h2 className="text-primary fw-bold">{count}</h2>
        <Link to={link} className="btn btn-outline-primary btn-sm mt-3">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
