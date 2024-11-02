import React from 'react';
import '../styles/components/CircularProgressBar.css'; // Your CSS file

const CircularProgressBar = ({ score, size = 100, strokeWidth = 10 }) => {
  // Ensure the score is between 0 and 100
  const validatedScore = Math.max(0, Math.min(score, 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (validatedScore / 100) * circumference;
  const color = validatedScore>50?"green":"red"
  return (
    <svg
      className="CircularProgressBar"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      <circle
        className="CircularProgressBar-Background"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
      />
      <circle
        className={`CircularProgressBar-Progress ${color}`}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
      <text
        className="CircularProgressBar-Text"
        x="50%"
        y="50%"
        dy=".3em"
        textAnchor="middle"
      >
        {validatedScore}%
      </text>
    </svg>
  );
};

export default CircularProgressBar;
