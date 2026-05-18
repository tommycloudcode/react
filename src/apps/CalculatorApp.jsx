import { useState } from 'react'
import '../styles/CalculatorApp.css'

const BUTTONS = [
  'C', '←', '/', '*',
  '7', '8', '9', '-',
  '4', '5', '6', '+',
  '1', '2', '3', '=',
  '0', '.',
]

function evaluate(expr) {
  try {
    const value = Function(`"use strict";return (${expr})`)()
    if (value === Infinity || value === -Infinity || Number.isNaN(value)) throw new Error()
    return String(value)
  } catch {
    return 'Error'
  }
}

export default function CalculatorApp() {
  const [expression, setExpression] = useState('')
  const [output, setOutput] = useState('0')
  const [error, setError] = useState('')

  const handle = (button) => {
    if (button === 'C') {
      setExpression(''); setOutput('0'); setError('')
      return
    }
    if (button === '←') {
      setExpression(p => p.slice(0, -1)); setError('')
      return
    }
    if (button === '=') {
      if (!expression.trim()) return
      const result = evaluate(expression)
      if (result === 'Error') {
        setError('Invalid expression')
      } else {
        setExpression(result); setOutput(result); setError('')
      }
      return
    }
    setExpression(p => p + button); setError('')
  }

  return (
    <div className="calculator-app">
      <div className="calculator-card">
        <div className="calculator-display">
          <div className="calculator-expression">{expression || '0'}</div>
          <div className="calculator-output">{error || output}</div>
        </div>
        <div className="calculator-grid">
          {BUTTONS.map(btn => (
            <button
              key={btn}
              className={`calc-button${btn === '=' ? ' equals' : ''}${btn === 'C' ? ' clear' : ''}`}
              onClick={() => handle(btn)}
              type="button"
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
