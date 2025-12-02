import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Canvas as FabricCanvas, FabricImage, Textbox, Line, FabricObject } from 'fabric';
import { useStore } from '../store';
import type { CanvasElement, TextElement, LineElement, ImageElement } from '../types';

interface CanvasProps {
  width?: number;
  height?: number;
}

export interface CanvasRef {
  getFabricCanvas: () => FabricCanvas | null;
}

/**
 * Canvas component that wraps Fabric.js for poster creation
 * Handles rendering of text, line, and image elements with drag-and-drop support
 */
export const Canvas = forwardRef<CanvasRef, CanvasProps>(({ width = 800, height = 600 }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  
  const elements = useStore((state) => state.elements);
  const selectedElementId = useStore((state) => state.selectedElementId);
  const canvasBackground = useStore((state) => state.canvasBackground);
  const updateElement = useStore((state) => state.updateElement);
  const setSelectedElement = useStore((state) => state.setSelectedElement);

  // Expose the Fabric canvas instance to parent components
  useImperativeHandle(ref, () => ({
    getFabricCanvas: () => fabricCanvasRef.current,
  }));

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    // Create Fabric canvas with white background
    const canvas = new FabricCanvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#ffffff',
    });

    fabricCanvasRef.current = canvas;

    // Handle object selection
    canvas.on('selection:created', (e: any) => {
      const selected = e.selected?.[0];
      if (selected && (selected as any).elementId) {
        setSelectedElement((selected as any).elementId);
      }
    });

    canvas.on('selection:updated', (e: any) => {
      const selected = e.selected?.[0];
      if (selected && (selected as any).elementId) {
        setSelectedElement((selected as any).elementId);
      }
    });

    canvas.on('selection:cleared', () => {
      setSelectedElement(null);
    });

    // Handle object modifications (drag, scale, rotate)
    canvas.on('object:modified', (e: any) => {
      const obj = e.target;
      if (!obj || !(obj as any).elementId) return;

      const elementId = (obj as any).elementId;
      const updates: Partial<CanvasElement> & Record<string, any> = {
        x: obj.left || 0,
        y: obj.top || 0,
        rotation: obj.angle || 0,
      };

      // Add type-specific updates
      if (obj.type === 'textbox' || obj.type === 'text') {
        const textObj = obj as Textbox;
        updates.width = textObj.width || 0;
        updates.height = textObj.height || 0;
      } else if (obj.type === 'line') {
        const lineObj = obj as Line;
        updates.length = Math.sqrt(
          Math.pow((lineObj.x2 || 0) - (lineObj.x1 || 0), 2) + 
          Math.pow((lineObj.y2 || 0) - (lineObj.y1 || 0), 2)
        );
      } else if (obj.type === 'image') {
        const imgObj = obj as FabricImage;
        updates.width = (imgObj.width || 0) * (imgObj.scaleX || 1);
        updates.height = (imgObj.height || 0) * (imgObj.scaleY || 1);
      }

      updateElement(elementId, updates);
    });

    // Note: Aspect ratio is locked via lockUniScaling property on image objects
    // No need for scaling event handler that causes re-renders

    // Cleanup
    return () => {
      canvas.dispose();
    };
  }, [width, height, setSelectedElement, updateElement]);

  // Update canvas background
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    if (canvasBackground) {
      FabricImage.fromURL(canvasBackground).then((img) => {
        img.scaleToWidth(canvas.width || width);
        img.scaleToHeight(canvas.height || height);
        canvas.backgroundImage = img;
        canvas.renderAll();
      });
    } else {
      canvas.backgroundColor = '#ffffff';
      canvas.backgroundImage = undefined;
      canvas.renderAll();
    }
  }, [canvasBackground, width, height]);

  // Render elements on canvas
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Clear all objects
    canvas.remove(...canvas.getObjects());

    // Sort elements by zIndex
    const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

    // Render each element
    const renderPromises = sortedElements.map(async (element) => {
      let fabricObject: FabricObject | null = null;

      switch (element.type) {
        case 'text': {
          const textEl = element as TextElement;
          fabricObject = new Textbox(textEl.content, {
            left: textEl.x,
            top: textEl.y,
            width: textEl.width,
            fontSize: textEl.fontSize,
            fontFamily: textEl.fontFamily,
            fill: textEl.color,
            angle: textEl.rotation,
            editable: true,
          });
          (fabricObject as any).elementId = textEl.id;
          
          // Handle text content changes during inline editing
          (fabricObject as any).on('changed', () => {
            const textbox = fabricObject as Textbox;
            updateElement(textEl.id, { 
              content: textbox.text || '',
              width: textbox.width || textEl.width,
              height: textbox.height || textEl.height,
            });
          });
          break;
        }

        case 'line': {
          const lineEl = element as LineElement;
          fabricObject = new Line([0, 0, lineEl.length, 0], {
            left: lineEl.x,
            top: lineEl.y,
            stroke: lineEl.color,
            strokeWidth: lineEl.thickness,
            angle: lineEl.rotation,
          });
          (fabricObject as any).elementId = lineEl.id;
          break;
        }

        case 'image': {
          const imgEl = element as ImageElement;
          if (!imgEl.isBackground) {
            try {
              const img = await FabricImage.fromURL(imgEl.src);
              img.set({
                left: imgEl.x,
                top: imgEl.y,
                angle: imgEl.rotation,
                scaleX: imgEl.width / (img.width || 1),
                scaleY: imgEl.height / (img.height || 1),
                lockUniScaling: true, // Lock aspect ratio during scaling
              });
              (img as any).elementId = imgEl.id;
              fabricObject = img;
            } catch (error) {
              console.error('Failed to load image:', error);
            }
          }
          break;
        }
      }

      if (fabricObject) {
        canvas.add(fabricObject);

        // Select if this is the selected element
        if (selectedElementId === element.id) {
          canvas.setActiveObject(fabricObject);
        }
      }
    });

    Promise.all(renderPromises).then(() => {
      canvas.renderAll();
    });
  }, [elements, selectedElementId]);

  return (
    <div className="canvas-container border-2 border-gray-300 rounded-lg overflow-hidden">
      <canvas ref={canvasRef} />
    </div>
  );
});
