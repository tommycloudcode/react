import { useState } from 'react'
import MenuBar from './components/MenuBar'
import MacWindow from './components/MacWindow'
import MacButton from './components/MacButton'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('Welcome to macOS App!')

  const handlePrimaryAction = () => {
    setCount(count + 1)
    setMessage('Button clicked!')
  }

  const handleSecondaryAction = () => {
    setMessage('Secondary action performed')
  }

  const handleDangerAction = () => {
    setCount(0)
    setMessage('Count reset!')
  }

  return (
    <div className="app-container">
      <MenuBar title="My macOS App" />
      <div className="window-container">
        <MacWindow title="My macOS App">
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
                onClick={handlePrimaryAction}
              >
                Increment Count
              </MacButton>
              <MacButton 
                variant="secondary"
                onClick={handleSecondaryAction}
              >
                Secondary Action
              </MacButton>
              <MacButton 
                variant="danger"
                onClick={handleDangerAction}
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
                <li>Smooth animations and transitions</li>
                <li>Responsive design</li>
              </ul>
            </div>
          </div>
        </MacWindow>
      </div>
    </div>
  )
}

export default App
