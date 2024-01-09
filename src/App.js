import React, { useEffect, useRef, useState, useCallback } from 'react';

const App = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [canvasx, setCanvasX] = useState(0);
  const [canvasy, setCanvasY] = useState(0);

  const [mouseCoordinates, setMouseCoordinates] = useState({ x: 0, y: 0 });
  const [mouseDown, setMouseDown] = useState(false);

  const [toolType, setToolType] = useState('draw');
  const [brushSize, setBrushSize] = useState(10);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  const [canvasLines, setCanvasLines] = useState([]);
  const [drawLines, setDrawLines] = useState([]);
  const [eraseLines, setEraseLines] = useState([]);
  const [linesArray, setLinesArray] = useState([]);
  const [eraseArray, setEraseArray] = useState([]);
  const [clear, setClear] = useState(false);

  const handleUseTool = useCallback((tool) => {
    setToolType(tool);
  }, []);

  const handleBrushSizeChange = useCallback((size) => {
    setBrushSize(size);
  }, []);

  const handleColorChange = useCallback((color) => {
    setStrokeColor(color);
  }, []);

  const handleBackgroundColorChange = useCallback((color) => {
    setBackgroundColor(color);
  }, []);

  const handleMouseDown = useCallback((e) => {
    const x = parseInt(e.clientX - canvasx);
    const y = parseInt(e.clientY - canvasy);
    setMouseCoordinates({ x, y });
    setMouseDown(true);
  }, [canvasx, canvasy]);

  const handleMouseUp = useCallback(() => {
    setMouseDown(false);

    if (canvasLines.length > 0) {
      const updatedArray = toolType === 'draw' ? [...linesArray] : [...eraseArray];

      updatedArray.push({
        line: toolType === 'draw' ? [...canvasLines] : null,
        erase: toolType === 'erase' ? [...canvasLines] : null,
        props: { size: brushSize, color: strokeColor },
      });

      if (toolType === 'draw') {
        setLinesArray(updatedArray);
      } else {
        setEraseArray(updatedArray);
      }

      setCanvasLines([]);
    }
  }, [canvasLines, linesArray, eraseArray, toolType, brushSize, strokeColor]);

  const handleMouseMove = useCallback((e) => {
    const x = parseInt(e.clientX - canvasx);
    const y = parseInt(e.clientY - canvasy);

    if (mouseDown) {
      const ctx = ctxRef.current;

      if (ctx) {
        ctx.beginPath();

        if (toolType === 'draw') {
          ctx.globalCompositeOperation = 'source-over';
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = brushSize;
        } else {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.lineWidth = brushSize;
        }

        ctx.moveTo(mouseCoordinates.x, mouseCoordinates.y);
        ctx.lineTo(x, y);
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.stroke();
      }

      setCanvasLines([...canvasLines, { x, y }]);

      if (toolType === 'draw') {
        setDrawLines([...drawLines, { x, y }]);
      } else {
        setEraseLines([...eraseLines, { x, y }]);
      }
    }

    setMouseCoordinates({ x, y });
  }, [canvasx, canvasy, mouseDown, toolType, brushSize, strokeColor, mouseCoordinates, canvasLines, drawLines, eraseLines]);

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

  useEffect(() => {
    if (!mouseDown && canvasLines.length > 0) {
      setCanvasLines([]);
    }
  }, [mouseDown, canvasLines]);

  const handleClear = useCallback(() => {
    setClear(true);
    const ctx = ctxRef.current;
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setLinesArray([]);
    setEraseArray([]);
    setClear(false);
  }, [canvasRef]);

  const mostrarArrays = useCallback(() => {
    const linesString = linesArray.map((lineSet, index) => {
      const lineString = lineSet.line
        ? `line: [${lineSet.line.map(point => `{ x: ${point.x}, y: ${point.y} }`).join(', ')}]`
        : 'line: null';
      const eraseString = lineSet.erase
        ? `erase: [${lineSet.erase.map(point => `{ x: ${point.x}, y: ${point.y} }`).join(', ')}]`
        : 'erase: null';
      const props = lineSet.props || {};
      return `MyLine: {\n  ${lineString},\n  ${eraseString},\n  props: {\n    size: ${props.size || brushSize},\n    color: '${props.color || strokeColor}'\n  }\n}`;
    }).join(',\n');

    console.log(`lines: [\n${linesString}\n]`);
  }, [linesArray, brushSize, strokeColor]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'Arial, sans-serif' }}>
      <canvas
        ref={canvasRef}
        id="canvas"
        width={900}
        height={500}
        style={{
          border: '2px solid',
          backgroundColor: backgroundColor,
          margin: '10px',
        }}
      ></canvas>
      <div style={{ marginTop: '10px' }}>
        <button style={{ padding: '8px 16px', margin: '0 5px', fontSize: '14px', cursor: 'pointer' }} onClick={() => handleUseTool('draw')}>
          Draw
        </button>
        <button style={{ padding: '8px 16px', margin: '0 5px', fontSize: '14px', cursor: 'pointer' }} onClick={() => handleUseTool('erase')}>
          Erase
        </button>
        <label style={{ marginLeft: '10px', fontSize: '14px' }}>Size:</label>
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => handleBrushSizeChange(parseInt(e.target.value))}
          style={{ marginLeft: '5px' }}
        />
        <label style={{ marginLeft: '10px', fontSize: '14px' }}>Color:</label>
        <input
          type="color"
          value={strokeColor}
          onChange={(e) => handleColorChange(e.target.value)}
          style={{ marginLeft: '5px' }}
        />
        <label style={{ marginLeft: '10px', fontSize: '14px' }}>Background:</label>
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => handleBackgroundColorChange(e.target.value)}
          style={{ marginLeft: '5px' }}
        />
        <input type="button" value="Clear" onClick={handleClear} style={{ marginLeft: '10px', cursor: 'pointer' }} />
        <button onClick={mostrarArrays} style={{ padding: '8px 16px', margin: '0 5px', fontSize: '14px', cursor: 'pointer' }}>Mostrar Arrays</button>
      </div>
    </div>
  );
};

export default App;
