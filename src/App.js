import React, { useEffect, useRef, useState, useCallback } from 'react';

const App = () => {
  const canvasRef = useRef(null);
  const [canvasx, setCanvasX] = useState(0);
  const [canvasy, setCanvasY] = useState(0);
  const [lastMouseX, setLastMouseX] = useState(0);
  const [lastMouseY, setLastMouseY] = useState(0);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [mouseDown, setMouseDown] = useState(false);
  const [toolType, setToolType] = useState('draw');
  const [brushSize, setBrushSize] = useState(10);
  const [strokeColor, setStrokeColor] = useState('#000000');

  const handleUseTool = useCallback((tool) => {
    setToolType(tool);
  }, []);

  const handleBrushSizeChange = (size) => {
    setBrushSize(size);
  };
 wgsdhf
  const handleColorChange = (color) => {
    setStrokeColor(color);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setCanvasX(canvas.offsetLeft);
    setCanvasY(canvas.offsetTop);

    const handleMouseDown = (e) => {
      const x = parseInt(e.clientX - canvasx);
      const y = parseInt(e.clientY - canvasy);
      setLastMouseX(x);
      setMouseX(x);
      setLastMouseY(y);
      setMouseY(y);
      setMouseDown(true);
    };

    const handleMouseUp = () => {
      setMouseDown(false);
    };

    const handleMouseMove = (e) => {
      const x = parseInt(e.clientX - canvasx);
      const y = parseInt(e.clientY - canvasy);

      if (mouseDown) {
        ctx.beginPath();
        if (toolType === 'draw') {
          ctx.globalCompositeOperation = 'source-over';
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = brushSize;
        } else {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.lineWidth = brushSize;
        }
        ctx.moveTo(lastMouseX, lastMouseY);
        ctx.lineTo(x, y);
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.stroke();
      }
      setMouseX(x);
      setMouseY(y);
      setLastMouseX(x);
      setLastMouseY(y);
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [canvasRef, canvasx, canvasy, mouseDown, lastMouseX, lastMouseY, mouseX, mouseY, toolType, brushSize, strokeColor]);

  return (
    <div>
      <canvas ref={canvasRef} id="canvas" width={800} height={800} style={{ border: '2px solid' }}></canvas>
      <div>
        <button onClick={() => handleUseTool('draw')}>Draw</button>
        <button onClick={() => handleUseTool('erase')}>Erase</button>
        <label>Brush Size:</label>
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => handleBrushSizeChange(parseInt(e.target.value))}
        />
        <label>Stroke Color:</label>
        <input
          type="color"
          value={strokeColor}
          onChange={(e) => handleColorChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default App;
