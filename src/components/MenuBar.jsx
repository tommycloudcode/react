import { useState, useRef, useEffect } from 'react';
import '../styles/MenuBar.css';

export default function MenuBar({ title = 'Application' }) {
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menus = {
    File: [
      { label: 'New', shortcut: '⌘N', action: () => alert('New file created') },
      { label: 'Open', shortcut: '⌘O', action: () => alert('Open file dialog') },
      { label: 'Open Recent', shortcut: null, submenu: ['Recent File 1', 'Recent File 2'] },
      { separator: true },
      { label: 'Save', shortcut: '⌘S', action: () => alert('File saved') },
      { label: 'Save As...', shortcut: '⌘⇧S', action: () => alert('Save As dialog') },
      { separator: true },
      { label: 'Close', shortcut: '⌘W', action: () => alert('File closed') },
    ],
    Edit: [
      { label: 'Undo', shortcut: '⌘Z', action: () => alert('Undo') },
      { label: 'Redo', shortcut: '⌘⇧Z', action: () => alert('Redo') },
      { separator: true },
      { label: 'Cut', shortcut: '⌘X', action: () => alert('Cut') },
      { label: 'Copy', shortcut: '⌘C', action: () => alert('Copy') },
      { label: 'Paste', shortcut: '⌘V', action: () => alert('Paste') },
      { separator: true },
      { label: 'Select All', shortcut: '⌘A', action: () => alert('All selected') },
    ],
    View: [
      { label: 'Zoom In', shortcut: '⌘+', action: () => alert('Zoomed in') },
      { label: 'Zoom Out', shortcut: '⌘−', action: () => alert('Zoomed out') },
      { label: 'Reset Zoom', shortcut: '⌘0', action: () => alert('Zoom reset') },
      { separator: true },
      { label: 'Full Screen', shortcut: '⌃⌘F', action: () => alert('Full screen toggled') },
      { label: 'Show Sidebar', shortcut: '⌘⇧B', action: () => alert('Sidebar toggled') },
    ],
    Help: [
      { label: 'About', shortcut: null, action: () => alert('macOS App v1.0.0\nBuilt with React + Vite') },
      { label: 'Documentation', shortcut: null, action: () => alert('Opening documentation...') },
      { label: 'Report Issue', shortcut: null, action: () => alert('Opening issue reporter...') },
    ],
  };

  const handleMenuClick = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const handleMenuItemClick = (action) => {
    if (action) {
      action();
    }
    setOpenMenu(null);
  };

  return (
    <div className="menu-bar" ref={menuRef}>
      <div className="menu-bar-left">
        {Object.keys(menus).map((menuName) => (
          <div key={menuName} className="menu-container">
            <div
              className={`menu-item ${openMenu === menuName ? 'active' : ''}`}
              onClick={() => handleMenuClick(menuName)}
            >
              {menuName}
            </div>
            {openMenu === menuName && (
              <div className="dropdown-menu">
                {menus[menuName].map((item, index) => (
                  <div key={index}>
                    {item.separator ? (
                      <div className="menu-separator"></div>
                    ) : (
                      <div
                        className="menu-dropdown-item"
                        onClick={() => handleMenuItemClick(item.action)}
                      >
                        <span className="menu-label">{item.label}</span>
                        {item.shortcut && <span className="menu-shortcut">{item.shortcut}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="menu-bar-center">
        <span className="window-title">{title}</span>
      </div>
      <div className="menu-bar-right">
        <div className="menu-container">
          <div
            className={`menu-item ${openMenu === 'Options' ? 'active' : ''}`}
            onClick={() => handleMenuClick('Options')}
          >
            Options
          </div>
          {openMenu === 'Options' && (
            <div className="dropdown-menu dropdown-menu-right">
              <div className="menu-dropdown-item" onClick={() => handleMenuItemClick(() => alert('Settings opened'))}>
                <span className="menu-label">Settings</span>
                <span className="menu-shortcut">⌘,</span>
              </div>
              <div className="menu-dropdown-item" onClick={() => handleMenuItemClick(() => alert('Preferences opened'))}>
                <span className="menu-label">Preferences</span>
              </div>
              <div className="menu-separator"></div>
              <div className="menu-dropdown-item" onClick={() => handleMenuItemClick(() => alert('Quit app'))}>
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
