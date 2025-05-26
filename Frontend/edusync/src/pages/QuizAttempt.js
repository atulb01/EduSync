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

  const calculateScore = (questions, answers) => {
    let score = 0;
    questions.forEach((q, i) => {
      if (
        answers[i] &&
        q.answer &&
        answers[i].trim().toLowerCase() === q.answer.trim().toLowerCase()
      ) {
        score += 1;
      }
    });
    return score;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const score = calculateScore(quiz.questions, answers);

    try {
      await API.post('/results', {
        assessmentId: quiz.assessmentId,
        userId: user.userId || user.id,
        score: score,
        attemptDate: new Date().toISOString().split('T')[0]
      });
      setMessage('Quiz submitted!');
      setTimeout(() => navigate('/results'), 2000);
    } catch (err) {
      console.error('Submission failed:', err);
      setMessage('Submission failed');
    }
  };

  if (!quiz) return <p>Loading quiz...</p>;

  return (
    <div className="col-md-8 offset-md-2 mt-4">
      <h2>{quiz.title}</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        {quiz.questions.map((q, idx) => (
          <div className="form-group mb-3" key={idx}>
            <label><strong>{q.question}</strong></label>
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
        <button className="btn btn-success" type="submit">Submit</button>
      </form>
    </div>
  );
}

export default QuizAttempt;
