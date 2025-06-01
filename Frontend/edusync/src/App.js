import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './components/Unauthorized';

import Login from './pages/Login';
import Register from './pages/Register';
import CourseList from './pages/CourseList';
import CourseDetails from './pages/CourseDetails';
import CourseUpload from './pages/CourseUpload';
import QuizAttempt from './pages/QuizAttempt';
import Results from './pages/Results';
import AssessmentUpload from './pages/AssessmentUpload';
import MyCourses from './pages/MyCourses';
import Dashboard from './pages/Dashboard';
import ViewAssessments from './pages/ViewAssessments';


function App() {
  const { user } = useAuth();
  return (
    <>
      {user && <Navbar />}
      <div className="container mt-4">
        <Routes>
          <Route path = "/" element = {<Login/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path="/courses" element={
            <ProtectedRoute allowedRoles={['Student']}>
              <CourseList />
            </ProtectedRoute>
          } />
          <Route path="/courses/:id" element={
            <ProtectedRoute allowedRoles={['Student']}>
              <CourseDetails />
            </ProtectedRoute>
          } />
          <Route path="/courses/:id/quiz" element={
            <ProtectedRoute allowedRoles={['Student']}>
              <QuizAttempt />
            </ProtectedRoute>
          } />
          <Route path="/upload" element={
            <ProtectedRoute allowedRoles={['Instructor']}>
              <CourseUpload />
            </ProtectedRoute>
          } />
          <Route path="/results" element={
            <ProtectedRoute allowedRoles={['Student', 'Instructor']}>
              <Results />
            </ProtectedRoute>
          } />
          <Route path="/upload-assessment" element={
            <ProtectedRoute allowedRoles={['Instructor']}>
              <AssessmentUpload />
            </ProtectedRoute>
          } />
          <Route path="/my-courses" element={
            <ProtectedRoute allowedRoles={['Instructor']}>
             <MyCourses />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['Instructor', 'Student']}>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/view-assessments" element={
            <ProtectedRoute allowedRoles={['Instructor']}>
              <ViewAssessments />
            </ProtectedRoute>
          } />

        </Routes>
      </div>
    </>
  );
}

export default App;
