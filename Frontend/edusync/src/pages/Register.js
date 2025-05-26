import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

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
    <div className="col-md-6 offset-md-3 mt-4">
      <h2>Register</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Name</label>
          <input className="form-control" name="name" value={form.name}
            onChange={handleChange} required />
        </div>
        <div className="form-group mb-3">
          <label>Email</label>
          <input className="form-control" type="email" name="email" value={form.email}
            onChange={handleChange} required />
        </div>
        <div className="form-group mb-3">
          <label>Password</label>
          <input className="form-control" type="password" name="password" value={form.password}
            onChange={handleChange} required />
        </div>
        <div className="form-group mb-3">
          <label>Role</label>
          <select className="form-control" name="role" value={form.role} onChange={handleChange}>
            <option value="Student">Student</option>
            <option value="Instructor">Instructor</option>
          </select>
        </div>
        <button className="btn btn-primary" type="submit">Register</button>
        <p className="mt-3">Already have an account? <a href="/login">Login here</a></p>
      </form>
    </div>
  );
}

export default Register;
