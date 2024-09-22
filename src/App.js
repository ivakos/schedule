import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import './styles/normilize.css';
import './App.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Select schedule</h1>
      <button onClick={() => navigate('/schedule/teacher')}>My teacher's schedule</button>
      <button onClick={() => navigate('/schedule/student')}>My class schedule</button>
    </div>
  );
};

const Schedule = () => {
  const { role } = useParams();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Select day of the week</h1>
      <ul className="day__wrapper">
        {days.map((day) => (
          <li key={day}>
            <button onClick={() => navigate(`/schedule/${role}/${day}`)}>{day}</button>
          </li>
        ))}
      </ul>
      <button onClick={() => window.history.back()}>go back</button>
    </div>
  );
};

const Lesson = ({ value, style }) => (
  <div className="lesson">
    <p style={style}>{value || 'Error'}</p>
  </div>
);

const DaySchedule = () => {
  const { role, day } = useParams();
  const [schedule, setSchedules] = useState({});
  const [timeSchedule, setTimeSchedule] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/schedule.json').then(res => res.json()),
      fetch('/timeSchedule.json').then(res => res.json())
    ]).then(([scheduleData, timeData]) => {
      setSchedules(scheduleData);
      setTimeSchedule(timeData);
      setLoading(false);
    }).catch(error => console.error('Ошибка загрузки:', error));
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const listLessons = [];

  role === 'teacher'
    ? listLessons.push(
      <div className='lesson' key="header">
        <p style={{ minWidth: '30px' }}>№</p>
        <p style={{ minWidth: '100px' }}>time</p>
        <p style={{ minWidth: '100px' }}>class</p>
        <p style={{ minWidth: '55px' }}>room</p>
      </div>
    )
    : listLessons.push(
      <div className='lesson' key="header">
        <p style={{ minWidth: '30px' }}>№</p>
        <p style={{ minWidth: '100px' }}>time</p>
        <p style={{ minWidth: '100px' }}>subject</p>
        <p style={{ minWidth: '55px' }}>room</p>
      </div>
    );

  const lessons = schedule[role]?.[day] || [];

  for (let index = 1; index <= (role === 'teacher' ? 12 : 6); index++) {
    const lesson = lessons[index] || {};

    listLessons.push(
      <div className='lesson' key={index}>
        <Lesson style={{ minWidth: '30px' }} value={index > 6 ? index - 6 : index} />
        {role === 'teacher' ? (
          <>
            <Lesson style={{ minWidth: '100px' }} value={timeSchedule[index] || '-'} />
            <Lesson style={{ minWidth: '100px' }} value={lesson.class || '-'} />
            <Lesson style={{ minWidth: '55px' }} value={lesson.classroom || '-'} />
          </>
        ) : (
          <>
            <Lesson style={{ minWidth: '100px' }} value={timeSchedule[index] || '-'} />
            <Lesson style={{ minWidth: '100px' }} value={lesson.subject || '-'} />
            <Lesson style={{ minWidth: '55px' }} value={lesson.classroom || '-'} />
          </>
        )}
      </div>
    );
  }

  return (
    <div className='container'>
      <h1>{role === "teacher" ? "My teacher's schedule" : "My class schedule"}</h1>
      <h1>{day}</h1>
      <div className='lessons__wrapper'>
        {listLessons}
      </div>
      <button onClick={() => window.history.back()}>go back</button>
    </div>
  );
};


const App = () => {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schedule/:role" element={<Schedule />} />
          <Route path="/schedule/:role/:day" element={<DaySchedule />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
