'use client';

import React from 'react';

interface CaretProps {
  top: number;
  left: number;
  isBlinking: boolean;
  smooth?: boolean;
}

const Caret: React.FC<CaretProps> = ({ top, left, isBlinking, smooth = true }) => {
  return (
    <div
      className={`caret absolute transition-all duration-75 ${isBlinking ? 'caret-blink' : ''} ${smooth ? 'caret-smooth' : ''}`}
      style={{
        top: `${top}px`,
        left: `${left}px`,
      }}
    />
  );
};

export default Caret;
