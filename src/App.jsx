import { useState, useCallback, useRef } from 'react'
import MenuBar from './components/MenuBar'
import MacWindow from './components/MacWindow'
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
  const [expression, setExpression] = useState('')
  const [output, setOutput] = useState('0')
  const [error, setError] = useState('')

  const buttons = [
    'C', '←', '/', '*',
    '7', '8', '9', '-',
    '4', '5', '6', '+',
    '1', '2', '3', '=',
    '0', '.',
  ]

  const evaluateExpression = (expr) => {
    try {
      const value = Function(`"use strict";return (${expr})`)()
      if (value === Infinity || value === -Infinity || Number.isNaN(value)) {
        throw new Error('Invalid result')
      }
      return String(value)
    } catch {
      return 'Error'
    }
  }

  const handleButtonClick = (button) => {
    if (button === 'C') {
      setExpression('')
      setOutput('0')
      setError('')
      return
    }

    if (button === '←') {
      setExpression((prev) => prev.slice(0, -1))
      setError('')
      return
    }

    if (button === '=') {
      if (!expression.trim()) {
        return
      }
      const result = evaluateExpression(expression)
      if (result === 'Error') {
        setError('Invalid expression')
      } else {
        setExpression(result)
        setOutput(result)
        setError('')
      }
      return
    }

    setExpression((prev) => prev + button)
    setError('')
  }

  return (
    <div className="app-content">
      <h1>Simple Calculator</h1>
      <p className="subtitle">Click buttons or build an expression</p>

      <div className="calculator-card">
        <div className="calculator-display">
          <div className="calculator-expression">{expression || '0'}</div>
          <div className="calculator-output">{error || output}</div>
        </div>

        <div className="calculator-grid">
          {buttons.map((button) => (
            <button
              key={button}
              className={`calc-button ${button === '=' ? 'equals' : ''} ${button === 'C' ? 'clear' : ''}`}
              onClick={() => handleButtonClick(button)}
              type="button"
            >
              {button}
            </button>
          ))}
        </div>
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
