import React from 'react';
import '../styles/MacButton.css';

export default function MacButton({ 
  children, 
  variant = 'secondary',
  onClick = () => {},
  disabled = false 
}) {
  return (
    <button 
      className={`mac-button mac-button-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
