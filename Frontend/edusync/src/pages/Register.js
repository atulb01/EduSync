import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaUserTag, FaUserPlus } from 'react-icons/fa';

function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Student' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password, form.role);
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4 rounded-4" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className="text-center mb-4 text-primary">
          <FaUserPlus className="me-2" />
          Create an Account
        </h2>

        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label className="form-label fw-bold">Name</label>
            <div className="input-group">
              <span className="input-group-text"><FaUser /></span>
              <input
                className="form-control"
                name="name"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group mb-3">
            <label className="form-label fw-bold">Email</label>
            <div className="input-group">
              <span className="input-group-text"><FaEnvelope /></span>
              <input
                className="form-control"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group mb-3">
            <label className="form-label fw-bold">Password</label>
            <div className="input-group">
              <span className="input-group-text"><FaLock /></span>
              <input
                className="form-control"
                type="password"
                name="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group mb-4">
            <label className="form-label fw-bold">Role</label>
            <div className="input-group">
              <span className="input-group-text"><FaUserTag /></span>
              <select className="form-select" name="role" value={form.role} onChange={handleChange}>
                <option value="Student">Student</option>
                <option value="Instructor">Instructor</option>
              </select>
            </div>
          </div>

          <div className="d-grid">
            <button className="btn btn-primary btn-lg" type="submit">
              <FaUserPlus className="me-2" />
              Register
            </button>
          </div>
        </form>

        <p className="mt-4 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-decoration-none">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
