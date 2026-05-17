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
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState({ width: 600, height: 400 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeRef = useRef({ startX: 0, startY: 0, startW: 600, startH: 400 });
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

  useEffect(() => {
    if (!isResizing) return;

    const MIN_WIDTH = 320;
    const MIN_HEIGHT = 220;

    const handleMouseMove = (e) => {
      if (isMaximized) return;
      setSize({
        width: Math.max(MIN_WIDTH, resizeRef.current.startW + (e.clientX - resizeRef.current.startX)),
        height: Math.max(MIN_HEIGHT, resizeRef.current.startH + (e.clientY - resizeRef.current.startY)),
      });
    };

    const handleMouseUp = () => setIsResizing(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, isMaximized]);

  const handleResizeMouseDown = (e) => {
    e.stopPropagation();
    if (isMaximized) return;
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: size.width,
      startH: size.height,
    };
    setIsResizing(true);
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
    : { left: position.x, top: position.y, width: size.width, height: size.height, zIndex };

  return (
    <div
      ref={windowRef}
      className={[
        'mac-window',
        isMaximized && 'maximized',
        isMinimized && 'minimized',
        isDragging && 'dragging',
        isResizing && 'resizing',
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
      {!isMinimized && <div className="window-content">{children}</div>}      {!isMaximized && !isMinimized && (
        <div
          className="resize-handle"
          onMouseDown={handleResizeMouseDown}
          title="Resize"
        />
      )}    </div>
  );
}
