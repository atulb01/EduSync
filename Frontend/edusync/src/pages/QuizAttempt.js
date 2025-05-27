import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';

function QuizAttempt() {
  const { id } = useParams(); // courseId
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    API.get(`/assessments/bycourse/${id}`)
      .then(res => {
        const parsedQuestions = JSON.parse(res.data.questions);
        setQuiz({ ...res.data, questions: parsedQuestions });
        setAnswers(Array(parsedQuestions.length).fill(''));
      })
      .catch(err => {
        console.error('Failed to load assessment:', err);
        setMessage('Error loading quiz.');
      });
  }, [id]);

  const handleChange = (value, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const calculateScore = (questions, answers, maxScore) => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (
        answers[i] &&
        q.answer &&
        answers[i].trim().toLowerCase() === q.answer.trim().toLowerCase()
      ) {
        correct += 1;
      }
    });
    return Math.round((correct / questions.length) * maxScore);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const score = calculateScore(quiz.questions, answers, quiz.maxScore);

    try {
      await API.post('/results', {
        assessmentId: quiz.assessmentId,
        userId: user.userId || user.id,
        score: score,
        attemptDate: new Date().toISOString().split('T')[0]
      });
      setMessage(`Quiz submitted! Your score: ${score}/${quiz.maxScore}`);
      setTimeout(() => navigate('/results'), 2500);
    } catch (err) {
      console.error('Submission failed:', err);
      setMessage('Submission failed');
    }
  };

  if (!quiz) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Loading quiz...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 rounded-4">
        <h2 className="text-center mb-4">{quiz.title}</h2>
        {message && <div className="alert alert-info text-center">{message}</div>}

        <form onSubmit={handleSubmit}>
          {quiz.questions.map((q, idx) => (
            <div className="mb-4" key={idx}>
              <p className="fw-semibold">{idx + 1}. {q.question}</p>
              {q.options.map((opt, i) => (
                <div className="form-check" key={i}>
                  <input
                    type="radio"
                    name={`q-${idx}`}
                    className="form-check-input"
                    value={opt}
                    checked={answers[idx] === opt}
                    onChange={() => handleChange(opt, idx)}
                    required
                  />
                  <label className="form-check-label">{opt}</label>
                </div>
              ))}
            </div>
          ))}

          <div className="d-grid">
            <button className="btn btn-success" type="submit">Submit Quiz</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuizAttempt;
