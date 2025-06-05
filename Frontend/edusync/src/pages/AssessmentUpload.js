import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { FaPlus, FaTrash, FaUpload } from 'react-icons/fa';

function AssessmentUpload() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    courseId: '',
    title: '',
    maxScore: '',
    questions: [
      {
        question: '',
        options: ['', '', '', ''],
        answer: ''
      }
    ]
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    API.get('/courses')
      .then(res => setCourses(res.data))
      .catch(err => console.error('Error loading courses:', err));
  }, []);

  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...form.questions];
    if (field.startsWith('option')) {
      const optIndex = parseInt(field.split('-')[1]);
      updated[index].options[optIndex] = value;
    } else {
      updated[index][field] = value;
    }
    setForm({ ...form, questions: updated });
  };

  const addQuestion = () => {
    setForm({
      ...form,
      questions: [
        ...form.questions,
        { question: '', options: ['', '', '', ''], answer: '' }
      ]
    });
  };

  const removeQuestion = index => {
    const updated = [...form.questions];
    updated.splice(index, 1);
    setForm({ ...form, questions: updated });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await API.post('/assessments', {
        assessmentId: crypto.randomUUID(),
        courseId: form.courseId,
        title: form.title,
        maxScore: parseInt(form.maxScore),
        questions: JSON.stringify(form.questions)
      });
      setMessage('Assessment uploaded successfully!');
      setForm({
        courseId: '',
        title: '',
        maxScore: '',
        questions: [{ question: '', options: ['', '', '', ''], answer: '' }]
      });
    } catch (err) {
      console.error('Upload failed:', err.response?.data || err.message);
      setMessage('Failed to upload assessment.');
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">📘 Create MCQ Assessment</h3>
          {message && <div className="alert alert-info">{message}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Course</label>
              <select
                className="form-select"
                name="courseId"
                value={form.courseId}
                onChange={handleFormChange}
                required
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course.courseId} value={course.courseId}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Assessment Title</label>
              <input
                className="form-control"
                name="title"
                value={form.title}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Max Score</label>
              <input
                className="form-control"
                name="maxScore"
                type="number"
                value={form.maxScore}
                onChange={handleFormChange}
                required
              />
            </div>

            <h5 className="text-primary mb-3">📝 Questions</h5>
            {form.questions.map((q, idx) => (
              <div key={idx} className="border rounded p-3 mb-4 bg-light">
                <div className="mb-2">
                  <label className="form-label">Question {idx + 1}</label>
                  <input
                    className="form-control"
                    value={q.question}
                    onChange={e => handleQuestionChange(idx, 'question', e.target.value)}
                    required
                  />
                </div>

                {q.options.map((opt, optIdx) => (
                  <div className="mb-2" key={optIdx}>
                    <label className="form-label">Option {optIdx + 1}</label>
                    <input
                      className="form-control"
                      value={opt}
                      onChange={e =>
                        handleQuestionChange(idx, `option-${optIdx}`, e.target.value)
                      }
                      required
                    />
                  </div>
                ))}

                <div className="mb-3">
                  <label className="form-label">Correct Answer</label>
                  <input
                    className="form-control"
                    value={q.answer}
                    onChange={e => handleQuestionChange(idx, 'answer', e.target.value)}
                    required
                  />
                </div>

                <div className="text-end">
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => removeQuestion(idx)}
                  >
                    <FaTrash className="me-1" />
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <button type="button" className="btn btn-outline-secondary mb-4" onClick={addQuestion}>
              <FaPlus className="me-1" />
              Add Question
            </button>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary btn-lg">
                <FaUpload className="me-2" />
                Submit Assessment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AssessmentUpload;
