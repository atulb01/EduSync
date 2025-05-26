import React, { useState } from 'react';
import API from '../api/api';
import { useAuth } from '../context/AuthContext'; // ✅ import useAuth

function CourseUpload() {
  const { user } = useAuth(); // ✅ get logged-in instructor
  const [form, setForm] = useState({ title: '', description: '', mediaUrl: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await API.post('/courses', {
        ...form,
        instructorId: user.userId || user.id // ✅ include instructor ID
      });

      setMessage('Upload successful!');
      setForm({ title: '', description: '', mediaUrl: '' });
    } catch (err) {
      console.error("Upload failed:", err);
      setMessage('Upload failed.');
    }
  };

  return (
    <div className="col-md-6 offset-md-3 mt-4">
      <h2>Upload Course</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Title</label>
          <input
            className="form-control"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Description</label>
          <textarea
            className="form-control"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Media URL</label>
          <input
            className="form-control"
            name="mediaUrl"
            type="url"
            value={form.mediaUrl}
            onChange={handleChange}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit">Upload</button>
      </form>
    </div>
  );
}

export default CourseUpload;
