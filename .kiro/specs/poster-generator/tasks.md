# Implementation Plan

- [x] 1. Set up project structure and dependencies
  - Initialize React project with TypeScript and Vite
  - Install dependencies: React, Fabric.js (or Konva.js for canvas), Zustand for state management, Vitest and fast-check for testing
  - Configure TypeScript with strict mode
  - Set up CSS framework (Tailwind CSS or CSS Modules)
  - Create folder structure: components/, hooks/, utils/, types/, store/
  - _Requirements: All requirements_

- [ ] 2. Implement core data models and types
  - Define TypeScript interfaces for CanvasElement, TextElement, LineElement, ImageElement
  - Define Action interface for undo/redo history
  - Define PresetSize type and dimension mappings
  - Define AppState interface
  - _Requirements: 1.1, 2.1, 4.1, 6.1, 7.2, 8.2, 9.4_

- [ ] 3. Implement state management with action history
  - Create Zustand store for application state
  - Implement action creators: addElement, updateElement, deleteElement, clearCanvas
  - Implement history management: recordAction, undo, redo
  - Implement state selectors for elements, selectedElement, canUndo, canRedo
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3_

- [ ]* 3.1 Write property test for action history recording
  - **Property 1: Action history recording**
  - **Validates: Requirements 2.1**

- [ ]* 3.2 Write property test for undo functionality
  - **Property 2: Undo reverses actions**
  - **Validates: Requirements 2.2**

- [ ]* 3.3 Write property test for undo-redo round trip
  - **Property 3: Undo-redo round trip**
  - **Validates: Requirements 2.3**

- [ ]* 3.4 Write property test for clear canvas
  - **Property 4: Clear canvas resets state**
  - **Validates: Requirements 3.1, 3.2, 3.3**

- [ ]* 3.5 Write unit tests for state management
  - Test action creators produce correct actions
  - Test history index management
  - Test state immutability

- [ ] 4. Build canvas component with Fabric.js
  - Create Canvas component that wraps Fabric.js canvas
  - Implement canvas initialization with white background
  - Implement element rendering for text, lines, and images
  - Implement element selection handling
  - Implement drag-and-drop for all element types
  - _Requirements: 1.1, 4.3, 6.3, 7.3, 10.4_

- [ ]* 4.1 Write property test for element dragging
  - **Property 6: Element dragging updates position**
  - **Validates: Requirements 4.3, 6.3, 7.3**

- [ ]* 4.2 Write unit tests for canvas rendering
  - Test canvas initialization
  - Test element rendering for each type
  - Test selection state updates

- [ ] 5. Implement text element functionality
  - Create addText function that creates TextElement with default properties
  - Implement text editing (inline editing on canvas)
  - Implement font family selector with common fonts list
  - Implement color picker for text color
  - Implement font size adjustment controls
  - _Requirements: 4.1, 4.2, 4.5, 5.2, 5.3, 5.4_

- [ ]* 5.1 Write property test for adding text
  - **Property 5: Adding text increases element count**
  - **Validates: Requirements 4.1**

- [ ]* 5.2 Write property test for font changes
  - **Property 8: Font changes update text element**
  - **Validates: Requirements 4.5**

- [ ]* 5.3 Write property test for color changes
  - **Property 9: Color changes update element**
  - **Validates: Requirements 5.2**

- [ ]* 5.4 Write property test for text size changes
  - **Property 10: Text size changes update element**
  - **Validates: Requirements 5.4**

- [ ] 6. Implement line element functionality
  - Create addLine function that creates LineElement with default properties
  - Implement line rendering on canvas
  - Implement line adjustment controls (length, thickness, rotation, color)
  - _Requirements: 6.1, 6.2, 10.2_

- [ ]* 6.1 Write property test for adding line
  - **Property 11: Adding line increases element count**
  - **Validates: Requirements 6.1**

- [ ]* 6.2 Write property test for rotation
  - **Property 19: Rotation updates element orientation**
  - **Validates: Requirements 10.2**

- [ ] 7. Implement element deletion functionality
  - Create deleteElement function that removes element from state
  - Add delete button or keyboard shortcut (Delete key) for selected elements
  - Update canvas when element is deleted
  - _Requirements: 4.4, 6.4, 7.5_

- [ ]* 7.1 Write property test for element deletion
  - **Property 7: Element deletion reduces count**
  - **Validates: Requirements 4.4, 6.4, 7.5**

- [ ] 8. Implement logo upload functionality
  - Create file input for logo upload
  - Implement file validation (type, size)
  - Create ImageElement from uploaded file
  - Implement image positioning and dragging
  - Implement image resizing with aspect ratio preservation
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ]* 8.1 Write property test for image upload
  - **Property 12: Image upload creates element**
  - **Validates: Requirements 7.2**

- [ ]* 8.2 Write property test for aspect ratio preservation
  - **Property 13: Image resize preserves aspect ratio**
  - **Validates: Requirements 7.4**

- [ ]* 8.3 Write unit tests for file upload
  - Test file validation logic
  - Test image loading
  - Test error handling for invalid files

- [ ] 9. Implement background image functionality
  - Create file input for background upload
  - Implement setBackground function that updates canvas background
  - Implement background scaling to fit canvas
  - Implement removeBackground function that resets to white
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ]* 9.1 Write property test for background image
  - **Property 14: Background image updates canvas**
  - **Validates: Requirements 8.2, 8.3**

- [ ]* 9.2 Write property test for background removal
  - **Property 15: Background removal restores white**
  - **Validates: Requirements 8.4**

- [ ] 10. Build toolbar component
  - Create Toolbar component with undo, redo, clear buttons
  - Implement button states (disabled when no actions available)
  - Add buttons for adding text and lines
  - Connect toolbar actions to state management
  - _Requirements: 1.2, 2.2, 2.3, 2.4, 2.5, 3.1_

- [ ]* 10.1 Write unit tests for toolbar
  - Test button rendering
  - Test button disabled states
  - Test button click handlers

- [ ] 11. Build properties panel component
  - Create PropertiesPanel component that displays based on selected element type
  - Implement font selector dropdown
  - Implement color picker component
  - Implement size/dimension input controls
  - Implement rotation control
  - Connect property changes to state updates
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.2, 10.1, 10.2_

- [ ]* 11.1 Write unit tests for properties panel
  - Test panel displays correct controls for each element type
  - Test property change handlers
  - Test panel hides when no element selected

- [ ] 12. Implement z-index management
  - Add controls to move elements forward/backward in layer order
  - Implement bringToFront and sendToBack functions
  - Update canvas rendering to respect z-index
  - _Requirements: 10.4_

- [ ]* 12.1 Write property test for z-index changes
  - **Property 20: Z-index changes reorder elements**
  - **Validates: Requirements 10.4**

- [ ] 13. Implement export functionality
  - Create ExportDialog component with name input and preset size selector
  - Implement preset size options: Instagram Story (1080x1920), Instagram Post (1080x1080), WhatsApp (1200x630), Twitter (1200x675)
  - Implement canvas-to-PNG conversion using toBlob API
  - Implement filename sanitization utility
  - Implement download trigger with custom filename
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ]* 13.1 Write property test for export filename
  - **Property 16: Export uses custom filename**
  - **Validates: Requirements 9.2**

- [ ]* 13.2 Write property test for preset size export
  - **Property 17: Preset size export matches dimensions**
  - **Validates: Requirements 9.4**

- [ ]* 13.3 Write property test for PNG export
  - **Property 18: Export produces PNG format**
  - **Validates: Requirements 9.5**

- [ ]* 13.4 Write unit tests for export utilities
  - Test filename sanitization
  - Test preset dimension mappings
  - Test canvas scaling for presets

- [ ] 14. Implement error handling and validation
  - Add file upload validation (type, size limits)
  - Add input validation for text, colors, dimensions
  - Implement error boundaries for React components
  - Add user-friendly error messages and notifications
  - _Requirements: All requirements (error handling)_

- [ ]* 14.1 Write unit tests for validation functions
  - Test file validation logic
  - Test input sanitization
  - Test error message generation

- [ ] 15. Add keyboard shortcuts and accessibility
  - Implement keyboard shortcuts: Ctrl+Z (undo), Ctrl+Y (redo), Delete (remove element)
  - Add ARIA labels to all interactive elements
  - Implement focus management for keyboard navigation
  - Test with screen readers
  - _Requirements: 1.2, 2.2, 2.3, 4.4_

- [ ]* 15.1 Write unit tests for keyboard shortcuts
  - Test keyboard event handlers
  - Test shortcut actions trigger correct state changes

- [ ] 16. Style and polish UI
  - Apply consistent styling to all components
  - Implement responsive layout for different screen sizes
  - Add visual feedback for interactions (hover states, active states)
  - Ensure color contrast meets accessibility standards
  - Add loading states for async operations
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 17. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
