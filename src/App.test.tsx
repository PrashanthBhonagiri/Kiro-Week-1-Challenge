import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock the Canvas component to avoid Fabric.js initialization issues in tests
vi.mock('./components', () => ({
  Canvas: () => <div data-testid="canvas-mock">Canvas Component</div>,
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
