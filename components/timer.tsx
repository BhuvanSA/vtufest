// components/Timer.js
import { useState, useEffect } from 'react';

const Timer = ({ initialSeconds = 60 }) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: 'right', fontSize: '12px', fontWeight: 'bold' }}>
      <p>Time Remaining: {seconds}s</p>
    </div>
  );
};

export default Timer;