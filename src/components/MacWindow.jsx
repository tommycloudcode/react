import { useState, useRef, useEffect } from 'react';
import '../styles/MacWindow.css';

export default function MacWindow({ title = 'Application', children }) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const windowRef = useRef(null);
  const titlebarRef = useRef(null);

  const handleTitlebarMouseDown = (e) => {
    if (isMaximized) return;
    
    setIsDragging(true);
    const rect = windowRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || isMaximized) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, isMaximized]);

  const handleClose = () => {
    setIsClosed(true);
    setTimeout(() => {
      setIsClosed(false);
      setIsMaximized(false);
      setIsMinimized(false);
    }, 400);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (!isMaximized) {
      setPosition({ x: 0, y: 0 });
    }
  };

  if (isClosed) {
    return (
      <div className="mac-window closed">
        <div className="window-closed-message">
          <p>Window closed</p>
          <button onClick={() => setIsClosed(false)} className="reopen-btn">
            Reopen Window
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={windowRef}
      className={`mac-window ${isMaximized ? 'maximized' : ''} ${
        isMinimized ? 'minimized' : ''
      } ${isDragging ? 'dragging' : ''}`}
      style={
        !isMaximized
          ? {
              transform: `translate(${position.x}px, ${position.y}px)`,
            }
          : {}
      }
    >
      <div
        className="window-titlebar"
        ref={titlebarRef}
        onMouseDown={handleTitlebarMouseDown}
      >
        <div className="traffic-lights">
          <button
            className="traffic-light red"
            title="Close"
            onClick={handleClose}
          ></button>
          <button
            className="traffic-light yellow"
            title="Minimize"
            onClick={handleMinimize}
          ></button>
          <button
            className="traffic-light green"
            title="Maximize"
            onClick={handleMaximize}
          ></button>
        </div>
        <div className="titlebar-title">{title}</div>
        <div className="titlebar-spacer"></div>
      </div>
      {!isMinimized && <div className="window-content">{children}</div>}
    </div>
  );
}
