import '../styles/Taskbar.css'

export default function Taskbar({ windows, activeId, onFocus, appRegistry }) {
  return (
    <div className="taskbar">
      {windows.length === 0 ? (
        <span className="taskbar-hint">Double-click a desktop icon to open an app</span>
      ) : (
        windows.map(win => {
          const app = appRegistry.find(a => a.id === win.appId)
          return (
            <button
              key={win.instanceId}
              className={`taskbar-item${win.instanceId === activeId ? ' active' : ''}`}
              onClick={() => onFocus(win.instanceId)}
              title={app?.name}
            >
              <span className="taskbar-icon">{app?.icon}</span>
              <span className="taskbar-name">{app?.name}</span>
            </button>
          )
        })
      )}
    </div>
  )
}
