import { useState, useCallback, useRef } from 'react'
import MenuBar from './components/MenuBar'
import MacWindow from './components/MacWindow'
import MacButton from './components/MacButton'
import './App.css'

const WINDOW_W = 600
const WINDOW_H = 400
const MENU_H = 22

let idCounter = 0

function getInitialPosition(index) {
  const desktopW = window.innerWidth
  const desktopH = window.innerHeight - MENU_H
  const baseX = Math.max(20, (desktopW - WINDOW_W) / 2)
  const baseY = Math.max(20, (desktopH - WINDOW_H) / 2)
  const stagger = (index % 8) * 30
  return { x: baseX + stagger, y: baseY + stagger }
}

function AppContent() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('Welcome to macOS App!')

  return (
    <div className="app-content">
      <h1>Welcome to macOS App</h1>
      <p className="subtitle">Built with React + Vite</p>

      <div className="card">
        <h2>Counter Demo</h2>
        <div className="counter-display">
          <span className="counter-value">{count}</span>
        </div>
        <p className="status-message">{message}</p>
      </div>

      <div className="button-group">
        <MacButton
          variant="primary"
          onClick={() => { setCount(c => c + 1); setMessage('Button clicked!') }}
        >
          Increment Count
        </MacButton>
        <MacButton
          variant="secondary"
          onClick={() => setMessage('Secondary action performed')}
        >
          Secondary Action
        </MacButton>
        <MacButton
          variant="danger"
          onClick={() => { setCount(0); setMessage('Count reset!') }}
        >
          Reset
        </MacButton>
      </div>

      <div className="info-section">
        <h3>Features</h3>
        <ul>
          <li>macOS-style window with traffic lights</li>
          <li>Menu bar at the top</li>
          <li>Native-looking buttons</li>
          <li>Double-click desktop icon to open new instance</li>
          <li>Multiple simultaneous windows supported</li>
        </ul>
      </div>
    </div>
  )
}

export default function App() {
  const [windows, setWindows] = useState([])
  const topZ = useRef(10)
  const openCount = useRef(0)

  const openWindow = useCallback(() => {
    const id = ++idCounter
    const index = openCount.current++
    const position = getInitialPosition(index)
    const zIndex = ++topZ.current
    setWindows(prev => [...prev, { id, position, zIndex }])
  }, [])

  const closeWindow = useCallback((id) => {
    setWindows(prev => prev.filter(w => w.id !== id))
  }, [])

  const focusWindow = useCallback((id) => {
    const zIndex = ++topZ.current
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex } : w))
  }, [])

  return (
    <div className="app-container">
      <MenuBar title="My macOS App" />
      <div className="desktop">
        {windows.map(win => (
          <MacWindow
            key={win.id}
            title="My macOS App"
            initialPosition={win.position}
            zIndex={win.zIndex}
            onClose={() => closeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
          >
            <AppContent />
          </MacWindow>
        ))}

        <div className="desktop-icon" onDoubleClick={openWindow}>
          <div className="desktop-icon-img">🖥️</div>
          <span className="desktop-icon-label">My macOS App</span>
        </div>
      </div>
    </div>
  )
}
