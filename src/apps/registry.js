import CalculatorApp from './CalculatorApp'
import TextNoteApp from './TextNoteApp'

export const APPS = [
  {
    id: 'calculator',
    name: 'Calculator',
    icon: '🧮',
    defaultSize: { width: 360, height: 500 },
    component: CalculatorApp,
    getMenus: ({ newInstance, closeWindow }) => ({
      File: [
        { label: 'New Calculator', shortcut: '⌘N', action: newInstance },
        { separator: true },
        { label: 'Close', shortcut: '⌘W', action: closeWindow },
      ],
      Edit: [
        { label: 'Copy Result', shortcut: '⌘C', action: () => {} },
        { label: 'Clear', shortcut: '⌘⌫', action: () => {} },
      ],
    }),
  },
  {
    id: 'textnote',
    name: 'TextNote',
    icon: '📝',
    defaultSize: { width: 500, height: 420 },
    component: TextNoteApp,
    getMenus: ({ newInstance, closeWindow }) => ({
      File: [
        { label: 'New Note', shortcut: '⌘N', action: newInstance },
        { separator: true },
        { label: 'Close', shortcut: '⌘W', action: closeWindow },
      ],
      Edit: [
        { label: 'Undo', shortcut: '⌘Z', action: () => {} },
        { label: 'Redo', shortcut: '⌘⇧Z', action: () => {} },
        { separator: true },
        { label: 'Cut', shortcut: '⌘X', action: () => {} },
        { label: 'Copy', shortcut: '⌘C', action: () => {} },
        { label: 'Paste', shortcut: '⌘V', action: () => {} },
        { separator: true },
        { label: 'Select All', shortcut: '⌘A', action: () => {} },
      ],
      Format: [
        { label: 'Bold', shortcut: '⌘B', action: () => {} },
        { label: 'Italic', shortcut: '⌘I', action: () => {} },
        { label: 'Underline', shortcut: '⌘U', action: () => {} },
      ],
    }),
  },
]

export const DESKTOP_MENUS = {
  File: [
    { label: 'About This Desktop', shortcut: null, action: () => alert('macOS Desktop\nBuilt with React + Vite') },
  ],
  View: [
    { label: 'Arrange Icons', shortcut: null, action: () => {} },
  ],
}
