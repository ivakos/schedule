import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import './styles/normilize.css';
import './App.css';

const Schedule = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Select day of the week</h1>
      <ul className="day__wrapper">
        {days.map((day) => (
          <li key={day}>
            <button onClick={() => navigate(`/${day}`)}>{day}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Lesson = ({ value, style }) => (
  <div className="lesson">
    <p style={style}>{value || 'Error'}</p>
  </div>
);

const DaySchedule = () => {
  const { day } = useParams();
  const [schedule, setSchedules] = useState({});
  const [timeSchedule, setTimeSchedule] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/schedule/schedule.json').then(res => res.json()),
      fetch('/schedule/timeSchedule.json').then(res => res.json())
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

 listLessons.push(
      <div className='lesson' key="header">
        <p style={{ minWidth: '30px' }}>№</p>
        <p style={{ minWidth: '110px' }}>time</p>
        <p style={{ minWidth: '100px' }}>class</p>
        <p style={{ minWidth: '55px' }}>room</p>
      </div>
    )

  const lessons = schedule[day] || [];

  for (let index = 1; index <= 12; index++) {
    const lesson = lessons[index] || {};

    listLessons.push(
      <div className='lesson' key={index}>
        <Lesson style={{ minWidth: '30px' }} value={index > 6 ? index - 6 : index} />
          <>
            <Lesson style={{ minWidth: '100px' }} value={timeSchedule[index] || '-'} />
            <Lesson style={{ minWidth: '100px' }} value={lesson.class || '-'} />
            <Lesson style={{ minWidth: '55px' }} value={lesson.classroom || '-'} />
          </>
      </div>
    );
  }

  return (
    <div className='container'>
      <h1>{"My teacher's schedule"}</h1>
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
          {/* <Route path="/" element={<Home />} /> */}
          {/* <Route path="/schedule/:role" element={<Schedule />} /> */}
          <Route path="/" element={<Schedule />} />
          <Route path="/:day" element={<DaySchedule />} />
          {/* <Route path="/schedule/:role/:day" element={<DaySchedule />} /> */}
        </Routes>
      </Router>
    </div>
  );
};

export default App;
