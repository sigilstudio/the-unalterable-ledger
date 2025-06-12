
import React, { useState, useEffect } from 'react';

export const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatTimeUnit = (unit: number) => unit.toString().padStart(2, '0');

  return (
    <div className="text-2xl md:text-3xl text-ledger-accent font-bold tabular-nums">
      <span>{formatTimeUnit(time.getHours())}</span>
      <span className="animate-pulse mx-1">:</span>
      <span>{formatTimeUnit(time.getMinutes())}</span>
      <span className="animate-pulse mx-1">:</span>
      <span>{formatTimeUnit(time.getSeconds())}</span>
    </div>
  );
};
