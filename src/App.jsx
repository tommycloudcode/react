import { useState, useCallback, useRef, useMemo } from 'react'
import MenuBar from './components/MenuBar'
import MacWindow from './components/MacWindow'
import Taskbar from './components/Taskbar'
import { APPS, DESKTOP_MENUS } from './apps/registry'
import './App.css'

const MENU_H = 22
const TASKBAR_H = 44

let idCounter = 0

function getInitialPosition(index, { width, height }) {
  const desktopW = window.innerWidth
  const desktopH = window.innerHeight - MENU_H - TASKBAR_H
  const stagger = (index % 8) * 30
  return {
    x: Math.max(20, (desktopW - width) / 2) + stagger,
    y: Math.max(20, (desktopH - height) / 2) + stagger,
  }
}

export default function App() {
  const [windows, setWindows] = useState([])
  const [activeWindowId, setActiveWindowId] = useState(null)
  const topZ = useRef(10)
  const openCount = useRef(0)

  const openWindow = useCallback((appId) => {
    const appDef = APPS.find(a => a.id === appId)
    if (!appDef) return
    const instanceId = ++idCounter
    const position = getInitialPosition(openCount.current++, appDef.defaultSize)
    const zIndex = ++topZ.current
    setWindows(prev => [...prev, { instanceId, appId, position, zIndex }])
    setActiveWindowId(instanceId)
  }, [])

  const closeWindow = useCallback((instanceId) => {
    setWindows(prev => prev.filter(w => w.instanceId !== instanceId))
    setActiveWindowId(curr => curr === instanceId ? null : curr)
  }, [])

  const focusWindow = useCallback((instanceId) => {
    const zIndex = ++topZ.current
    setWindows(prev => prev.map(w => w.instanceId === instanceId ? { ...w, zIndex } : w))
    setActiveWindowId(instanceId)
  }, [])

  const activeWin = windows.find(w => w.instanceId === activeWindowId)
  const activeAppDef = activeWin ? APPS.find(a => a.id === activeWin.appId) : null
  
  const menusCallbacks = useMemo(() => {
    if (!activeWin || !activeAppDef) return null
    return {
      newInstance: () => openWindow(activeWin.appId),
      closeWindow: () => closeWindow(activeWin.instanceId),
    }
  }, [activeWin, activeAppDef, openWindow, closeWindow])
  
  /* eslint-disable react-hooks/refs */
  const currentMenus = useMemo(() => {
    if (activeAppDef && menusCallbacks) {
      return activeAppDef.getMenus(menusCallbacks)
    }
    return DESKTOP_MENUS
  }, [activeAppDef, menusCallbacks])
  /* eslint-enable react-hooks/refs */

  return (
    <div className="app-container">
      <MenuBar appName={activeAppDef?.name ?? 'Desktop'} menus={currentMenus} />
      <div className="desktop" onMouseDown={() => setActiveWindowId(null)}>
        {windows.map(win => {
          const appDef = APPS.find(a => a.id === win.appId)
          if (!appDef) return null
          const AppComponent = appDef.component
          const isActive = win.instanceId === activeWindowId
          return (
            <MacWindow
              key={win.instanceId}
              title={appDef.name}
              initialPosition={win.position}
              initialSize={appDef.defaultSize}
              zIndex={win.zIndex}
              isActive={isActive}
              onClose={() => closeWindow(win.instanceId)}
              onFocus={() => focusWindow(win.instanceId)}
            >
              <AppComponent />
            </MacWindow>
          )
        })}

        <div className="desktop-icons">
          {APPS.map(app => (
            <div
              key={app.id}
              className="desktop-icon"
              onDoubleClick={(e) => { e.stopPropagation(); openWindow(app.id) }}
              onMouseDown={e => e.stopPropagation()}
            >
              <div className="desktop-icon-img">{app.icon}</div>
              <span className="desktop-icon-label">{app.name}</span>
            </div>
          ))}
        </div>
      </div>
      <Taskbar
        windows={windows}
        activeId={activeWindowId}
        onFocus={focusWindow}
        appRegistry={APPS}
      />
    </div>
  )
}
