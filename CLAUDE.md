# Flow Fields Visualizer

A React.js app that generates and visualizes flow field patterns using particle systems and Perlin noise.

## Project Structure

```
src/
├── scss/           # SCSS stylesheets
│   ├── main.scss
│   └── modern-reset.scss
├── flow-field.js   # Flow field generation logic
├── main.jsx        # React entry point
├── App.jsx         # Main App component with canvas and Tweakpane UI
└── App.scss        # App component styles
```

## Features

- **Real-time flow field visualization** with particle trails
- **Interactive parameter control** via Tweakpane interface
- **Fullscreen canvas** that adapts to window size
- **JSON export** of particle data and parameters
- **Configurable parameters**:
  - Particle count (100-5000)
  - Flow amplitude (1-20)
  - Damping/friction (0.1-1.0)
  - Scale factor (0.1-3.0)
  - Visual settings (colors, transparency, line width)

## Dependencies

- `react` - UI framework
- `simplex-noise` - Perlin noise generation for flow fields
- `random-js` - Seeded random number generation
- `tweakpane` - Real-time parameter controls

## CSS/SCSS Conventions

- Use BEM (Block Element Modifier) naming methodology for CSS classes
- Follow the pattern: `.block__element--modifier`
- Styles should be placed in `src/scss/`
