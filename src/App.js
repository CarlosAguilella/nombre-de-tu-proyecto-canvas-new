import React, { useEffect, useRef, useState, useCallback } from 'react';

const App = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
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
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  const handleUseTool = useCallback((tool) => {
    setToolType(tool);
  }, []);

  const handleBrushSizeChange = (size) => {
    setBrushSize(size);
  };

  const handleColorChange = (color) => {
    setStrokeColor(color);
  };

  const handleBackgroundColorChange = (color) => {
    setBackgroundColor(color);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctxRef.current = ctx;

    const { left, top } = canvas.getBoundingClientRect();
    setCanvasX(left);
    setCanvasY(top);

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
        ctxRef.current.beginPath();
        if (toolType === 'draw') {
          ctxRef.current.globalCompositeOperation = 'source-over';
          ctxRef.current.strokeStyle = strokeColor;
          ctxRef.current.lineWidth = brushSize;
        } else {
          ctxRef.current.globalCompositeOperation = 'destination-out';
          ctxRef.current.lineWidth = brushSize;
        }
        ctxRef.current.moveTo(lastMouseX, lastMouseY);
        ctxRef.current.lineTo(x, y);
        ctxRef.current.lineJoin = ctxRef.current.lineCap = 'round';
        ctxRef.current.stroke();
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
  }, [canvasRef, canvasx, canvasy, ctxRef, lastMouseX, lastMouseY, mouseX, mouseY, toolType, brushSize, strokeColor]);

  const handleClear = () => {
    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <div>
      <canvas ref={canvasRef} id="canvas" width={800} height={800} style={{ border: '5px solid', backgroundColor: backgroundColor }}></canvas>
      <div>
        <button onClick={() => handleUseTool('draw')}>Draw</button>
        <button onClick={() => handleUseTool('erase')}>Erase</button>
        <label>Size:</label>
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => handleBrushSizeChange(parseInt(e.target.value))}
        />
        <label>Color:</label>
        <input
          type="color"
          value={strokeColor}
          onChange={(e) => handleColorChange(e.target.value)}
        />
        <label>Background:</label>
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => handleBackgroundColorChange(e.target.value)}
        />
        <input
          type="button"
          value="Clear"
          onClick={handleClear}
        />
      </div>
    </div>
  );
};

export default App;
