import { useState, useRef, useEffect } from 'react';
import '../styles/MacWindow.css';

export default function MacWindow({
  title = 'Application',
  children,
  onClose,
  onFocus,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 600, height: 400 },
  zIndex = 10,
}) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: initialSize.width, h: initialSize.height });
  const windowRef = useRef(null);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => {
      if (isMaximized) return;
      setPosition({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
    };
    const onUp = () => setIsDragging(false);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
  }, [isDragging, isMaximized]);

  useEffect(() => {
    if (!isResizing) return;
    const MIN_W = 280, MIN_H = 200;
    const onMove = (e) => {
      if (isMaximized) return;
      setSize({
        width: Math.max(MIN_W, resizeStart.current.w + (e.clientX - resizeStart.current.x)),
        height: Math.max(MIN_H, resizeStart.current.h + (e.clientY - resizeStart.current.y)),
      });
    };
    const onUp = () => setIsResizing(false);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
  }, [isResizing, isMaximized]);

  const handleWindowMouseDown = () => onFocus?.();

  const handleTitlebarMouseDown = (e) => {
    if (isMaximized) return;
    dragOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    setIsDragging(true);
  };

  const handleResizeMouseDown = (e) => {
    e.stopPropagation();
    if (isMaximized) return;
    resizeStart.current = { x: e.clientX, y: e.clientY, w: size.width, h: size.height };
    setIsResizing(true);
  };

  const handleClose = () => { setIsClosing(true); setTimeout(() => onClose?.(), 280); };
  const handleMinimize = () => setIsMinimized(v => !v);
  const handleMaximize = () => setIsMaximized(v => !v);

  const windowStyle = isMaximized
    ? { left: 0, top: 0, width: '100%', height: '100%', zIndex }
    : { left: position.x, top: position.y, width: size.width, height: size.height, zIndex };

  return (
    <div
      ref={windowRef}
      className={['mac-window', isMaximized && 'maximized', isMinimized && 'minimized',
        isDragging && 'dragging', isResizing && 'resizing', isClosing && 'closing']
        .filter(Boolean).join(' ')}
      style={windowStyle}
      onMouseDown={handleWindowMouseDown}
    >
      <div className="window-titlebar" onMouseDown={handleTitlebarMouseDown}>
        <div className="traffic-lights" onMouseDown={e => e.stopPropagation()}>
          <button className="traffic-light red" title="Close" onClick={handleClose} />
          <button className="traffic-light yellow" title="Minimize" onClick={handleMinimize} />
          <button className="traffic-light green" title="Maximize" onClick={handleMaximize} />
        </div>
        <div className="titlebar-title">{title}</div>
        <div className="titlebar-spacer" />
      </div>
      {!isMinimized && <div className="window-content">{children}</div>}
      {!isMaximized && !isMinimized && (
        <div className="resize-handle" onMouseDown={handleResizeMouseDown} title="Resize" />
      )}
    </div>
  );
}
