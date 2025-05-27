import React, { useState } from 'react';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';

function CourseUpload() {
  const { user } = useAuth();
  const [form, setForm] = useState({ title: '', description: '' });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!file) {
      setMessage('Please upload a file.');
      return;
    }

    try {
      // Upload file to Azure Blob via backend
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await API.post('/coursecontent/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const mediaUrl = uploadRes.data.url;

      // Submit course with media URL
      await API.post('/courses', {
        ...form,
        mediaUrl,
        instructorId: user.userId || user.id
      });

      setMessage('Course uploaded successfully!');
      setForm({ title: '', description: '' });
      setFile(null);
    } catch (err) {
      console.error('Upload failed:', err);
      setMessage('Upload failed.');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4 rounded-4" style={{ maxWidth: '600px', width: '100%' }}>
        <h2 className="text-center mb-4">Upload a New Course</h2>

        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label className="form-label">Title</label>
            <input
              className="form-control"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Course Title"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Brief description of the course"
              required
            />
          </div>

          <div className="form-group mb-4">
            <label className="form-label">Upload File (PDF, Video, etc.)</label>
            <input
              type="file"
              className="form-control"
              onChange={handleFileChange}
              accept="video/*,application/pdf"
              required
            />
          </div>

          <div className="d-grid">
            <button className="btn btn-primary" type="submit">Upload Course</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CourseUpload;
