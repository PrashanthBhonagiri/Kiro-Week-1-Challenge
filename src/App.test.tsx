import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock the components to avoid Fabric.js initialization issues in tests
vi.mock('./components', () => ({
  Canvas: () => <div data-testid="canvas-mock">Canvas Component</div>,
  Toolbar: () => <div data-testid="toolbar-mock">Toolbar Component</div>,
  PropertiesPanel: () => <div data-testid="properties-panel-mock">Properties Panel Component</div>,
  ExportDialog: () => <div data-testid="export-dialog-mock">Export Dialog Component</div>,
}));

import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/Simple Poster Generator/i)).toBeInTheDocument();
  });
  
  it('renders canvas component', () => {
    render(<App />);
    const canvas = screen.getByTestId('canvas-mock');
    expect(canvas).toBeInTheDocument();
  });
});
