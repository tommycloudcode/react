import { useState, useRef, useEffect } from 'react';
import '../styles/MacWindow.css';

export default function MacWindow({
  title = 'Application',
  children,
  onClose,
  onFocus,
  initialPosition = { x: 100, y: 100 },
  zIndex = 10,
}) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const dragOffset = useRef({ x: 0, y: 0 });
  const windowRef = useRef(null);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      if (isMaximized) return;
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    };

    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isMaximized]);

  const handleWindowMouseDown = () => onFocus?.();

  const handleTitlebarMouseDown = (e) => {
    if (isMaximized) return;
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    setIsDragging(true);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose?.(), 280);
  };

  const handleMinimize = () => setIsMinimized((v) => !v);

  const handleMaximize = () => {
    setIsMaximized((v) => !v);
  };

  const windowStyle = isMaximized
    ? { left: 0, top: 0, width: '100%', height: '100%', zIndex }
    : { left: position.x, top: position.y, zIndex };

  return (
    <div
      ref={windowRef}
      className={[
        'mac-window',
        isMaximized && 'maximized',
        isMinimized && 'minimized',
        isDragging && 'dragging',
        isClosing && 'closing',
      ]
        .filter(Boolean)
        .join(' ')}
      style={windowStyle}
      onMouseDown={handleWindowMouseDown}
    >
      <div
        className="window-titlebar"
        onMouseDown={handleTitlebarMouseDown}
      >
        <div className="traffic-lights" onMouseDown={(e) => e.stopPropagation()}>
          <button className="traffic-light red" title="Close" onClick={handleClose} />
          <button className="traffic-light yellow" title="Minimize" onClick={handleMinimize} />
          <button className="traffic-light green" title="Maximize" onClick={handleMaximize} />
        </div>
        <div className="titlebar-title">{title}</div>
        <div className="titlebar-spacer" />
      </div>
      {!isMinimized && <div className="window-content">{children}</div>}
    </div>
  );
}
