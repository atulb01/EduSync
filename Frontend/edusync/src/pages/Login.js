import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4 rounded-4" style={{ maxWidth: '450px', width: '100%' }}>
        <h2 className="text-center mb-4 text-primary">
          <FaSignInAlt className="me-2" />
          Login to EduSync
        </h2>

        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label className="form-label fw-bold">Email</label>
            <div className="input-group">
              <span className="input-group-text">
                <FaUser />
              </span>
              <input
                className="form-control"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group mb-4">
            <label className="form-label fw-bold">Password</label>
            <div className="input-group">
              <span className="input-group-text">
                <FaLock />
              </span>
              <input
                className="form-control"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="d-grid">
            <button className="btn btn-primary btn-lg" type="submit">
              <FaSignInAlt className="me-2" />
              Login
            </button>
          </div>
        </form>

        <p className="mt-4 text-center">
          Don’t have an account?{' '}
          <a href="/register" className="text-decoration-none">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
