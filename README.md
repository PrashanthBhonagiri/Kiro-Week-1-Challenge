# Simple Poster Generator Tool

A web-based application for creating custom posters with text, design elements, and images.

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Canvas Library**: Fabric.js
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Testing**: Vitest + fast-check (property-based testing)

## Project Structure

```
src/
├── components/     # React components
├── hooks/          # Custom React hooks
├── store/          # Zustand state management
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── test/           # Test setup and utilities
```

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Testing

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

## Features

- Add and edit text with customizable fonts, colors, and sizes
- Add basic design elements (lines)
- Upload and position logos
- Set custom background images
- Undo/redo functionality
- Export posters in various social media formats (Instagram, WhatsApp, Twitter)
- Drag-and-drop element positioning
- Layer management (z-index control)

## Requirements

See `.kiro/specs/poster-generator/requirements.md` for detailed requirements.

## Design

See `.kiro/specs/poster-generator/design.md` for architecture and design decisions.
