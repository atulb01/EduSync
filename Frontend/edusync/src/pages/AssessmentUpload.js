import React, { useState, useEffect } from 'react';
import API from '../api/api';

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
    <div className="col-md-8 offset-md-2 mt-4">
      <h2>Create MCQ Assessment</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Course</label>
          <select
            className="form-control"
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
        <div className="form-group mb-3">
          <label>Assessment Title</label>
          <input
            className="form-control"
            name="title"
            value={form.title}
            onChange={handleFormChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Max Score</label>
          <input
            className="form-control"
            name="maxScore"
            type="number"
            value={form.maxScore}
            onChange={handleFormChange}
            required
          />
        </div>

        <h5>Questions</h5>
        {form.questions.map((q, idx) => (
          <div key={idx} className="border p-3 mb-3">
            <div className="form-group mb-2">
              <label>Question {idx + 1}</label>
              <input
                className="form-control"
                value={q.question}
                onChange={e => handleQuestionChange(idx, 'question', e.target.value)}
                required
              />
            </div>
            {q.options.map((opt, optIdx) => (
              <div className="form-group mb-2" key={optIdx}>
                <label>Option {optIdx + 1}</label>
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
            <div className="form-group mb-2">
              <label>Correct Answer</label>
              <input
                className="form-control"
                value={q.answer}
                onChange={e => handleQuestionChange(idx, 'answer', e.target.value)}
                required
              />
            </div>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => removeQuestion(idx)}
            >
              Remove Question
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-secondary mb-3" onClick={addQuestion}>
          Add Question
        </button>
        <br />
        <button type="submit" className="btn btn-primary">
          Submit Assessment
        </button>
      </form>
    </div>
  );
}

export default AssessmentUpload;
