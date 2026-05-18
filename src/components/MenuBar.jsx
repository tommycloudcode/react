import { useState, useRef, useEffect } from 'react';
import '../styles/MenuBar.css';

export default function MenuBar({ appName = 'Desktop', menus = {} }) {
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);
  const prevAppName = useRef(appName);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenu(null);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown when active app changes
  useEffect(() => {
    if (prevAppName.current !== appName) {
      setOpenMenu(null);
      prevAppName.current = appName;
    }
  }, [appName]);

  const toggle = (name) => setOpenMenu(prev => (prev === name ? null : name));

  const runItem = (action) => {
    action?.();
    setOpenMenu(null);
  };

  return (
    <div className="menu-bar" ref={menuRef}>
      <div className="menu-bar-left">
        <span className="menu-app-name">{appName}</span>
        {Object.entries(menus).map(([name, items]) => (
          <div key={name} className="menu-container">
            <div
              className={`menu-item${openMenu === name ? ' active' : ''}`}
              onClick={() => toggle(name)}
            >
              {name}
            </div>
            {openMenu === name && (
              <div className="dropdown-menu">
                {items.map((item, i) =>
                  item.separator ? (
                    <div key={i} className="menu-separator" />
                  ) : (
                    <div key={i} className="menu-dropdown-item" onClick={() => runItem(item.action)}>
                      <span className="menu-label">{item.label}</span>
                      {item.shortcut && <span className="menu-shortcut">{item.shortcut}</span>}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="menu-bar-center">
        <span className="window-title">{appName}</span>
      </div>

      <div className="menu-bar-right">
        <div className="menu-container">
          <div
            className={`menu-item${openMenu === '__options' ? ' active' : ''}`}
            onClick={() => toggle('__options')}
          >
            Options
          </div>
          {openMenu === '__options' && (
            <div className="dropdown-menu dropdown-menu-right">
              <div className="menu-dropdown-item" onClick={() => runItem(() => alert('Settings'))}>
                <span className="menu-label">Settings</span>
                <span className="menu-shortcut">⌘,</span>
              </div>
              <div className="menu-separator" />
              <div className="menu-dropdown-item" onClick={() => runItem(() => alert('Quit'))}>
                <span className="menu-label">Quit</span>
                <span className="menu-shortcut">⌘Q</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
