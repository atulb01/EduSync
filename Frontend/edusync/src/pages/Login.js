import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

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
    <div className="col-md-6 offset-md-3 mt-4">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Email</label>
          <input className="form-control" type="email" value={email}
            onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-group mb-3">
          <label>Password</label>
          <input className="form-control" type="password" value={password}
            onChange={e => setPassword(e.target.value)} required />
        </div>
        <button className="btn btn-primary" type="submit">Login</button>
        <p className="mt-3">Don't have an account? <a href="/register">Register here</a></p>
      </form>
    </div>
  );
}

export default Login;
