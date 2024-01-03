import React, { useEffect, useRef, useState, useCallback } from 'react';

const App = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(canvasRef.current?.getContext('2d'));
  const [canvasx, setCanvasX] = useState(0);
  const [canvasy, setCanvasY] = useState(0);
  const [mouseCoordinates, setMouseCoordinates] = useState({ x: 0, y: 0 });
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

  const handleMouseDown = useCallback((e) => {
    const x = parseInt(e.clientX - canvasx);
    const y = parseInt(e.clientY - canvasy);
    setMouseCoordinates({ x, y });
    setMouseDown(true);
  }, [canvasx, canvasy]);

  const handleMouseUp = useCallback(() => {
    setMouseDown(false);
  }, []);

  const handleMouseMove = useCallback((e) => {
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
      ctxRef.current.moveTo(mouseCoordinates.x, mouseCoordinates.y);
      ctxRef.current.lineTo(x, y);
      ctxRef.current.lineJoin = ctxRef.current.lineCap = 'round';
      ctxRef.current.stroke();
    }
    setMouseCoordinates({ x, y });
  }, [canvasx, canvasy, mouseDown, toolType, brushSize, strokeColor, mouseCoordinates]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctxRef.current = ctx;

    const { left, top } = canvas.getBoundingClientRect();
    setCanvasX(left);
    setCanvasY(top);

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [canvasRef, handleMouseDown, handleMouseUp, handleMouseMove]);

  const handleClear = () => {
    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'Arial, sans-serif' }}>
      <canvas
        ref={canvasRef}
        id="canvas"
        width={900}
        height={800}
        style={{
          border: '2px solid',
          backgroundColor: backgroundColor,
          margin: '10px',
        }}
      ></canvas>
      <div style={{ marginTop: '10px' }}>
        <button style={buttonStyle} onClick={() => handleUseTool('draw')}>
          Draw
        </button>
        <button style={buttonStyle} onClick={() => handleUseTool('erase')}>
          Erase
        </button>
        <label style={labelStyle}>Size:</label>
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => handleBrushSizeChange(parseInt(e.target.value))}
          style={{ marginLeft: '5px' }}
        />
        <label style={labelStyle}>Color:</label>
        <input
          type="color"
          value={strokeColor}
          onChange={(e) => handleColorChange(e.target.value)}
          style={{ marginLeft: '5px' }}
        />
        <label style={labelStyle}>Background:</label>
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => handleBackgroundColorChange(e.target.value)}
          style={{ marginLeft: '5px' }}
        />
        <input type="button" value="Clear" onClick={handleClear} style={{ marginLeft: '10px', cursor: 'pointer' }} />
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '8px 16px',
  margin: '0 5px',
  fontSize: '14px',
  cursor: 'pointer',
};

const labelStyle = {
  marginLeft: '10px',
  fontSize: '14px',
};

export default App;