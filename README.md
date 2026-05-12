# macOS Application UI - React + Vite

A React + Vite application that mimics a native macOS application window with a menu bar, window controls, and native-looking UI components.

## Features

✨ **macOS-style Menu Bar** - Authentic top menu bar with File, Edit, View, and Help menus

🪟 **Native Window** - Complete window UI with:
- Title bar
- Animated traffic light buttons (red, yellow, green)
- Maximize/minimize functionality
- Native macOS window styling

🔘 **Custom Button Components** - Three button variants:
- Primary (blue) - For main actions
- Secondary (gray) - For alternative actions
- Danger (red) - For destructive actions

⚡ **Smooth Animations** - Transitions and hover effects throughout

## Project Structure

```
src/
├── components/
│   ├── MenuBar.jsx           # Top menu bar component
│   ├── MacWindow.jsx         # Window container with controls
│   └── MacButton.jsx         # Custom button component
├── styles/
│   ├── MenuBar.css           # Menu bar styling
│   ├── MacWindow.css         # Window and title bar styling
│   └── MacButton.css         # Button styling
├── App.jsx                   # Main application
├── App.css                   # App layout styling
└── index.css                 # Global styles
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens the application at `http://localhost:5173/`

### Build

```bash
npm run build
```

## Usage

The application includes a demo counter and interactive buttons:

- **Increment Count** - Increments the counter
- **Secondary Action** - Performs a secondary action
- **Reset** - Resets the counter to zero
- **Green Traffic Light** - Click to maximize/restore the window

## Customization

### Change the Title
Edit `App.jsx` to change the window and menu bar title:

```jsx
<MenuBar title="Your App Name" />
<MacWindow title="Your App Name">
```

### Add Menu Items
Edit `MenuBar.jsx` to add more menu items:

```jsx
<div className="menu-item">Your Menu</div>
```

### Change Button Actions
Edit `App.jsx` to modify button handlers:

```jsx
const handleCustomAction = () => {
  // Your action here
}
```

## Built With

- [React 18](https://react.dev) - UI library
- [Vite](https://vitejs.dev) - Build tool
- Vanilla CSS - Styling

## License

MIT

