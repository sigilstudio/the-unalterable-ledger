import React, { useState, useEffect } from 'react';

export const Clock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatTimeUnit = (unit: number) => unit.toString().padStart(2, '0');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="text-right">
      <div className="text-2xl md:text-3xl text-ledger-accent font-bold tabular-nums">
        <span>{formatTimeUnit(currentTime.getHours())}</span>
        <span className="animate-pulse mx-1">:</span>
        <span>{formatTimeUnit(currentTime.getMinutes())}</span>
        <span className="animate-pulse mx-1">:</span>
        <span>{formatTimeUnit(currentTime.getSeconds())}</span>
      </div>
      <div className="text-sm text-ledger-text-dim mt-1">
        {formatDate(currentTime)}
      </div>
    </div>
  );
};
