# Design Document

## Overview

The Simple Poster Generator Tool is a client-side web application built with modern web technologies. The application uses HTML5 Canvas for rendering poster elements, providing a responsive and interactive design experience. The architecture emphasizes simplicity, with a clear separation between the canvas rendering layer, state management, and user interface controls.

## Architecture

The application follows a component-based architecture with three primary layers:

1. **Presentation Layer**: UI components for toolbars, controls, and dialogs
2. **Application Layer**: State management, action history, and business logic
3. **Rendering Layer**: Canvas manipulation and element rendering

### Technology Stack

- **Frontend Framework**: React (for component-based UI)
- **Canvas Rendering**: HTML5 Canvas API or Fabric.js (for advanced canvas manipulation)
- **State Management**: React Context API or Zustand (lightweight state management)
- **Styling**: CSS Modules or Tailwind CSS
- **File Handling**: File API for uploads, Canvas toBlob for exports

## Components and Interfaces

### Core Components

#### 1. Canvas Component
The main workspace where users create posters.

```typescript
interface CanvasProps {
  width: number;
  height: number;
  elements: CanvasElement[];
  selectedElement: string | null;
  onElementSelect: (id: string) => void;
  onElementUpdate: (id: string, updates: Partial<CanvasElement>) => void;
}
```

#### 2. Toolbar Component
Contains primary actions (undo, redo, clear, add elements).

```typescript
interface ToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onAddText: () => void;
  onAddLine: () => void;
}
```

#### 3. Properties Panel Component
Displays and allows editing of selected element properties.

```typescript
interface PropertiesPanelProps {
  selectedElement: CanvasElement | null;
  onPropertyChange: (property: string, value: any) => void;
  availableFonts: string[];
}
```

#### 4. Export Dialog Component
Handles poster naming and size selection before download.

```typescript
interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (name: string, presetSize?: PresetSize) => void;
}
```

### Data Models

#### CanvasElement (Base)
```typescript
interface CanvasElement {
  id: string;
  type: 'text' | 'line' | 'image';
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
}
```

#### TextElement
```typescript
interface TextElement extends CanvasElement {
  type: 'text';
  content: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  width: number;
  height: number;
}
```

#### LineElement
```typescript
interface LineElement extends CanvasElement {
  type: 'line';
  length: number;
  thickness: number;
  color: string;
}
```

#### ImageElement
```typescript
interface ImageElement extends CanvasElement {
  type: 'image';
  src: string;
  width: number;
  height: number;
  isBackground: boolean;
}
```

#### PresetSize
```typescript
type PresetSize = 
  | 'instagram-story'    // 1080x1920
  | 'instagram-post'     // 1080x1080
  | 'whatsapp'           // 1200x630
  | 'twitter'            // 1200x675
  | null;                // Original canvas size
```

#### Action (for undo/redo)
```typescript
interface Action {
  type: 'add' | 'update' | 'delete' | 'clear';
  elementId?: string;
  previousState?: CanvasElement;
  newState?: CanvasElement;
  previousElements?: CanvasElement[];
}
```

### State Management

The application state includes:

```typescript
interface AppState {
  elements: CanvasElement[];
  selectedElementId: string | null;
  actionHistory: Action[];
  historyIndex: number;
  canvasBackground: string | null;
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, several properties can be consolidated:
- Properties 4.3, 6.3, and 7.3 all test dragging behavior and can be combined into a single "element dragging" property
- Properties 4.4, 6.4, and 7.5 all test deletion behavior and can be combined into a single "element deletion" property
- Properties 3.1, 3.2, and 3.3 all test the clear operation and can be combined into a comprehensive "clear canvas" property

### Core Properties

**Property 1: Action history recording**
*For any* action performed on the canvas (add, update, delete), that action should be recorded in the action history.
**Validates: Requirements 2.1**

**Property 2: Undo reverses actions**
*For any* canvas state and any recorded action, performing undo should restore the canvas to the state before that action was performed.
**Validates: Requirements 2.2**

**Property 3: Undo-redo round trip**
*For any* canvas state and any action, performing the action, then undo, then redo should result in the same canvas state as after the original action.
**Validates: Requirements 2.3**

**Property 4: Clear canvas resets state**
*For any* canvas state with any number of elements and any background, clearing the canvas should result in zero elements, white background, and empty action history.
**Validates: Requirements 3.1, 3.2, 3.3**

**Property 5: Adding text increases element count**
*For any* canvas state, adding a text element should increase the total element count by exactly one, and the new element should be of type 'text'.
**Validates: Requirements 4.1**

**Property 6: Element dragging updates position**
*For any* canvas element (text, line, or image) and any valid position coordinates, dragging that element should update its x and y properties to the new position.
**Validates: Requirements 4.3, 6.3, 7.3**

**Property 7: Element deletion reduces count**
*For any* canvas state with at least one element, deleting a specific element should reduce the total element count by exactly one, and that element should no longer exist in the canvas.
**Validates: Requirements 4.4, 6.4, 7.5**

**Property 8: Font changes update text element**
*For any* text element and any valid font family, changing the font should update that text element's fontFamily property to the new font.
**Validates: Requirements 4.5**

**Property 9: Color changes update element**
*For any* element that supports color (text or line) and any valid color value, changing the color should update that element's color property to the new color.
**Validates: Requirements 5.2**

**Property 10: Text size changes update element**
*For any* text element and any valid font size, changing the size should update that text element's fontSize property to the new size.
**Validates: Requirements 5.4**

**Property 11: Adding line increases element count**
*For any* canvas state, adding a line element should increase the total element count by exactly one, the new element should be of type 'line', and it should have default properties (color, thickness, length).
**Validates: Requirements 6.1**

**Property 12: Image upload creates element**
*For any* valid image file, uploading as a logo should create a new image element on the canvas with isBackground set to false.
**Validates: Requirements 7.2**

**Property 13: Image resize preserves aspect ratio**
*For any* image element with original width W and height H, resizing by any scale factor S should result in new dimensions (W×S, H×S), maintaining the ratio W/H.
**Validates: Requirements 7.4**

**Property 14: Background image updates canvas**
*For any* valid image file, setting it as the background should update the canvas background property and scale the image to fit canvas dimensions.
**Validates: Requirements 8.2, 8.3**

**Property 15: Background removal restores white**
*For any* canvas state with a background image, removing the background should set the canvas background to white (default).
**Validates: Requirements 8.4**

**Property 16: Export uses custom filename**
*For any* valid filename string and canvas state, exporting should produce a PNG file with that exact filename.
**Validates: Requirements 9.2**

**Property 17: Preset size export matches dimensions**
*For any* preset size selection (Instagram Story, Instagram Post, WhatsApp, Twitter), the exported image dimensions should exactly match the preset's defined dimensions.
**Validates: Requirements 9.4**

**Property 18: Export produces PNG format**
*For any* canvas state and export parameters, the exported file should be in PNG format with the custom name.
**Validates: Requirements 9.5**

**Property 19: Rotation updates element orientation**
*For any* canvas element and any valid rotation angle, rotating the element should update its rotation property to the new angle.
**Validates: Requirements 10.2**

**Property 20: Z-index changes reorder elements**
*For any* set of canvas elements, changing an element's z-index should reorder the rendering such that elements with higher z-index values appear above those with lower values.
**Validates: Requirements 10.4**

## Error Handling

### Input Validation

1. **File Upload Validation**
   - Validate file types (accept only image formats: PNG, JPG, JPEG, GIF, SVG)
   - Validate file size (limit to 10MB to prevent memory issues)
   - Handle corrupted or invalid image files gracefully

2. **Text Input Validation**
   - Handle empty text fields (allow but provide visual indication)
   - Sanitize text input to prevent XSS attacks
   - Handle special characters and Unicode properly

3. **Position Validation**
   - Ensure elements stay within canvas bounds during drag operations
   - Validate rotation angles (normalize to 0-360 degrees)
   - Validate size values (prevent negative or zero dimensions)

4. **Export Validation**
   - Validate filename (remove invalid characters, ensure .png extension)
   - Handle empty canvas export (allow but warn user)
   - Validate preset size selection

### Error States

1. **Canvas Rendering Errors**
   - Catch and log canvas API errors
   - Provide fallback rendering for unsupported operations
   - Display user-friendly error messages

2. **File Operation Errors**
   - Handle file read failures
   - Handle download failures (browser restrictions, storage issues)
   - Provide retry mechanisms for failed operations

3. **State Management Errors**
   - Implement error boundaries to catch React errors
   - Validate state updates before applying
   - Provide undo capability as error recovery mechanism

## Testing Strategy

### Unit Testing

The application will use **Vitest** as the testing framework for unit tests, providing fast execution and excellent TypeScript support.

**Unit Test Coverage:**

1. **State Management Functions**
   - Test action creators (addElement, updateElement, deleteElement)
   - Test reducer functions for state updates
   - Test history management (undo/redo logic)

2. **Utility Functions**
   - Test coordinate transformations
   - Test aspect ratio calculations
   - Test filename sanitization
   - Test preset size dimension mappings

3. **Component Rendering**
   - Test that components render without crashing
   - Test that components receive and display correct props
   - Test user interaction handlers (click, drag events)

4. **Export Functionality**
   - Test canvas-to-blob conversion
   - Test filename generation
   - Test preset size application

### Property-Based Testing

The application will use **fast-check** as the property-based testing library, which provides excellent TypeScript support and comprehensive generators for testing universal properties.

**Configuration:**
- Each property-based test will run a minimum of 100 iterations
- Tests will use custom generators for canvas elements, colors, positions, and other domain-specific types

**Property Test Implementation:**

Each correctness property from the design document will be implemented as a property-based test with the following format:

```typescript
// Example format
test('Property 1: Action history recording', () => {
  fc.assert(
    fc.property(
      canvasStateArbitrary(),
      actionArbitrary(),
      (initialState, action) => {
        // Feature: poster-generator, Property 1: Action history recording
        const newState = performAction(initialState, action);
        return newState.actionHistory.includes(action);
      }
    ),
    { numRuns: 100 }
  );
});
```

**Custom Generators:**

1. **Canvas State Generator**: Generates random canvas states with varying numbers of elements
2. **Element Generator**: Generates random text, line, and image elements with valid properties
3. **Action Generator**: Generates random actions (add, update, delete, clear)
4. **Position Generator**: Generates valid x, y coordinates within canvas bounds
5. **Color Generator**: Generates valid CSS color values
6. **Font Generator**: Generates font names from the supported font list
7. **Filename Generator**: Generates valid filename strings

**Property Test Tags:**

Each property-based test will include a comment tag in this exact format:
```typescript
// Feature: poster-generator, Property {number}: {property description}
```

This ensures traceability between design properties and test implementations.

### Integration Testing

1. **End-to-End User Flows**
   - Test complete poster creation workflow
   - Test export workflow with different preset sizes
   - Test undo/redo across multiple operations

2. **Canvas Interaction Testing**
   - Test drag-and-drop functionality
   - Test element selection and editing
   - Test multi-element interactions

### Test Execution

- Unit tests and property-based tests will run on every code change
- Integration tests will run before commits
- All tests must pass before merging to main branch

## Performance Considerations

1. **Canvas Rendering Optimization**
   - Use requestAnimationFrame for smooth drag operations
   - Implement dirty rectangle rendering to update only changed areas
   - Debounce property updates during continuous interactions

2. **State Management Optimization**
   - Implement immutable state updates for efficient change detection
   - Limit action history size (e.g., 50 actions) to prevent memory issues
   - Use memoization for expensive computations

3. **Image Handling Optimization**
   - Compress uploaded images if they exceed size thresholds
   - Use image caching to avoid re-loading
   - Implement lazy loading for background images

4. **Export Optimization**
   - Use Web Workers for image processing if available
   - Implement progress indicators for large exports
   - Cache rendered canvas for quick re-exports

## Security Considerations

1. **File Upload Security**
   - Validate file types on both client and server (if applicable)
   - Sanitize filenames to prevent path traversal attacks
   - Limit file sizes to prevent DoS attacks

2. **XSS Prevention**
   - Sanitize all user text input before rendering
   - Use React's built-in XSS protection
   - Avoid using dangerouslySetInnerHTML

3. **Data Privacy**
   - Process all data client-side (no server uploads)
   - Clear sensitive data from memory after export
   - Provide option to clear browser cache

## Accessibility Considerations

1. **Keyboard Navigation**
   - Support tab navigation through all controls
   - Implement keyboard shortcuts for common actions (Ctrl+Z for undo, etc.)
   - Provide focus indicators for all interactive elements

2. **Screen Reader Support**
   - Add ARIA labels to all controls
   - Provide text alternatives for visual elements
   - Announce state changes to screen readers

3. **Visual Accessibility**
   - Ensure sufficient color contrast for all UI elements
   - Support browser zoom without breaking layout
   - Provide visual feedback for all interactions

## Future Enhancements

1. **Additional Design Elements**
   - Shapes (rectangles, circles, polygons)
   - Icons and symbols library
   - Gradient and pattern fills

2. **Advanced Text Features**
   - Text alignment options
   - Text effects (shadow, outline, gradient)
   - Multi-line text with word wrap

3. **Collaboration Features**
   - Save/load poster projects
   - Template library
   - Share posters via URL

4. **Export Enhancements**
   - Additional export formats (JPG, SVG, PDF)
   - Batch export multiple sizes
   - Direct social media sharing
