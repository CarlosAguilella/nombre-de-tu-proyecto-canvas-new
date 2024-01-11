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

  const [drawLines, setDrawLines] = useState([]);
  const [eraseLines, setEraseLines] = useState([]);

  const [prueba, setPrueba] = useState([]);

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

    if (drawLines.length > 0 || eraseLines.length > 0) {
      let updatedArray = [...prueba];

      const newLineSet = {
        line: toolType === 'draw' ? [...drawLines] : null,
        erase: toolType === 'erase' ? [...eraseLines] : null,
        props: { size: brushSize, color: strokeColor },
      };

      updatedArray.push(newLineSet);

      setPrueba(updatedArray);
    }
  }, [drawLines, eraseLines, toolType, brushSize, strokeColor, prueba]);

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
        } else if (toolType === 'erase') {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.lineWidth = brushSize;
        }
        ctx.moveTo(mouseCoordinates.x, mouseCoordinates.y);
        ctx.lineTo(x, y);
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.stroke();
      }
      setMouseCoordinates({ x, y });
      if (toolType === 'draw') {
        setDrawLines((prevLines) => [...prevLines, { x, y }]);
      } else if (toolType === 'erase') {
        setEraseLines((prevLines) => [...prevLines, { x, y }]);
      }
    }
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

  useEffect(() => {
    if (!mouseDown && drawLines.length > 0) {
      setDrawLines([]);
    }
  }, [mouseDown, drawLines]);

  useEffect(() => {
    if (!mouseDown && eraseLines.length > 0) {
      setEraseLines([]);
    }
  }, [mouseDown, eraseLines]);

  const handleClear = useCallback(() => {
    const ctx = ctxRef.current;
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setPrueba([]);
  }, [canvasRef]);

  const mostrarArrays = useCallback(() => {
    const linesToDisplay = prueba;
    const linesString = linesToDisplay.map((lineSet, index) => {
      const lineString = lineSet.line
        ? `"line": [${lineSet.line.map(point => `{ "x": ${point.x}, "y": ${point.y} }`).join(', ')}]`
        : '"line": null';
      const eraseString = lineSet.erase
        ? `"erase": [${lineSet.erase.map(point => `{ "x": ${point.x}, "y": ${point.y} }`).join(', ')}]`
        : '"erase": null';
      const props = lineSet.props || {};
      return `{
        "MyLine": {
          ${lineString},
          ${eraseString},
          "props": {
            "size": ${props.size || brushSize}
            ${lineSet.erase ? '}' : `,"color": "${props.color || strokeColor}"}`
          }
        }
      }`;
          }).join(',\n');
    console.log(`{\n"lines": [\n${linesString}\n]\n}`);
  }, [toolType, drawLines, eraseLines, brushSize, strokeColor, prueba]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'Arial, sans-serif' }}>
      <canvas
        ref={canvasRef}
        id="canvas"
        width={800}
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
