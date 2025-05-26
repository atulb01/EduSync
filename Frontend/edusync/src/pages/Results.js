import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';

function Results() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [users, setUsers] = useState([]);
  const [minScore, setMinScore] = useState('');

  useEffect(() => {
    // Load all results
    API.get('/results').then(res => setResults(res.data)).catch(console.error);

    // Load all assessments (to resolve assessment titles)
    API.get('/assessments').then(res => setAssessments(res.data)).catch(console.error);

    // Load all users (to resolve student names)
    API.get('/usermodels').then(res => setUsers(res.data)).catch(console.error);
  }, []);

  // Helper lookups
  const getAssessmentTitle = id => {
    const a = assessments.find(x => x.assessmentId === id);
    return a ? a.title : id;
  };

  const getUserName = id => {
    const u = users.find(x => x.userId === id);
    return u ? u.name : id;
  };

  const filtered = results.filter(r =>
    (user.role === 'Instructor' || r.userId === user.userId || r.userId === user.id) &&
    (minScore === '' || r.score >= parseInt(minScore, 10))
  );

  return (
    <div className="col-md-10 offset-md-1 mt-4">
      <h2>Results</h2>
      <input
        className="form-control mb-3"
        type="number"
        placeholder="Filter by minimum score"
        value={minScore}
        onChange={e => setMinScore(e.target.value)}
      />
      <table className="table table-bordered">
        <thead>
          <tr>
            {user.role === 'Instructor' && <th>Student</th>}
            <th>Assessment</th>
            <th>Score</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(r => (
            <tr key={r.resultId}>
              {user.role === 'Instructor' && <td>{getUserName(r.userId)}</td>}
              <td>{getAssessmentTitle(r.assessmentId)}</td>
              <td>{r.score}</td>
              <td>{new Date(r.attemptDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Results;
