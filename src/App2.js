import React, { useState } from 'react';

const DrawingApp = () => {
  const [inputCode, setInputCode] = useState('');
  const [linesArray, setLinesArray] = useState([]);
  const [error, setError] = useState('');

  const drawLinesOnCanvas = () => {
    try {
      const parsedLines = JSON.parse(inputCode);
      setLinesArray(parsedLines.lines || []);
      setError('');
      console.log('Todo OK')
    } catch (error) {
      console.error('Error parsing JSON:', error);
      setError('Error parsing JSON. Please check your input.');
    }
  };

  const clearCanvas = () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const drawLines = () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    clearCanvas();

    linesArray.forEach((lineSet) => {
      if (lineSet.MyLine && lineSet.MyLine.line) {
        ctx.beginPath();
        ctx.strokeStyle = lineSet.MyLine.props.color || '#000000';
        ctx.lineWidth = lineSet.MyLine.props.size || 1;
        lineSet.MyLine.line.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      }
    });
  };

  return (
    <div>
      <textarea
        placeholder="Insert JSON code here"
        value={inputCode}
        onChange={(e) => setInputCode(e.target.value)}
        rows={35}
        cols={125}
      />
      <button onClick={drawLinesOnCanvas}>Save JSON</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={drawLines}>Show Lines</button>
      <canvas
        id="canvas"
        width={900}
        height={200}
        style={{
          border: '2px solid',
          margin: '10px',
        }}
      ></canvas>
    </div>
  );
};

export default DrawingApp;
