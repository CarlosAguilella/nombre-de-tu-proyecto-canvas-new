import React, { useEffect, useState, useRef } from 'react';

const App = () => {
  const [lineWidth, setLineWidth] = useState(2);
  const canvasRef = useRef(null);

  let canvas, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;
  let x = 'black',
    y = 2;

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const lineWidthInput = document.getElementById('lineWidthInput');
    lineWidthInput.addEventListener('input', handleLineWidthChange);

    return () => {
      lineWidthInput.removeEventListener('input', handleLineWidthChange);
    };
  }, [lineWidth]);

  const init = () => {
    canvas = canvasRef.current;
    ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 800;

    canvas.addEventListener('mousemove', (e) => findxy('move', e), false);
    canvas.addEventListener('mousedown', (e) => findxy('down', e), false);
    canvas.addEventListener('mouseup', (e) => findxy('up', e), false);
    canvas.addEventListener('mouseout', (e) => findxy('out', e), false);
  };

  const color = (obj) => {
    switch (obj.id) {
      case 'green':
        x = 'green';
        break;
      case 'blue':
        x = 'blue';
        break;
      case 'red':
        x = 'red';
        break;
      case 'yellow':
        x = 'yellow';
        break;
      case 'orange':
        x = 'orange';
        break;
      case 'black':
        x = 'black';
        break;
      case 'white':
        x = 'white';
        break;
    }
  };

  const draw = () => {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = x;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.closePath();
  };

  const drawRectangle = () => {
    ctx.beginPath();
    ctx.rect(prevX, prevY, currX, currY);
    ctx.strokeStyle = x;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();
  }

  const clearAll = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const findxy = (res, e) => {
    if (res === 'down') {
      prevX = currX;
      prevY = currY;
      currX = e.clientX - canvas.offsetLeft;
      currY = e.clientY - canvas.offsetTop;

      flag = true;
      dot_flag = true;
      if (dot_flag) {
        ctx.beginPath();
        ctx.fillStyle = x;
        ctx.fillRect(currX, currY, 2, 2);
        ctx.closePath();
        dot_flag = false;
      }
    }
    if (res === 'up' || res === 'out') {
      flag = false;
    }
    if (res === 'move') {
      if (flag) {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;
        draw();
      }
    }
  };

  const handleLineWidthChange = (e) => {
    setLineWidth(e.target.value);
    draw();
  };

  return (
    <div>
      <canvas ref={canvasRef} id="can" style={{ position: 'absolute', top: '1%', left: '1%', border: '2px solid' }}></canvas>
      <div style={{ position: 'absolute', top: '2%', left: '85%' }}>Choose Color</div>
      <div style={{ position: 'absolute', top: '5%', left: '87%', width: '15px', height: '15px', background: 'green', border: '2px solid' }} id="green" onClick={() => color(document.getElementById('green'))} ></div>
      <div style={{ position: 'absolute', top: '5%', left: '90%', width: '15px', height: '15px', background: 'blue', border: '2px solid' }} id="blue" onClick={() => color(document.getElementById('blue'))} ></div>
      <div style={{ position: 'absolute', top: '5%', left: '93%', width: '15px', height: '15px', background: 'red', border: '2px solid' }} id="red" onClick={() => color(document.getElementById('red'))} ></div>
      <div style={{ position: 'absolute', top: '8%', left: '87%', width: '15px', height: '15px', background: 'yellow', border: '2px solid' }} id="yellow" onClick={() => color(document.getElementById('yellow'))} ></div>
      <div style={{ position: 'absolute', top: '8%', left: '90%', width: '15px', height: '15px', background: 'orange', border: '2px solid' }} id="orange" onClick={() => color(document.getElementById('orange'))} ></div>
      <div style={{ position: 'absolute', top: '8%', left: '93%', width: '15px', height: '15px', background: 'black', border: '2px solid' }} id="black" onClick={() => color(document.getElementById('black'))} ></div>
      <div style={{ position: 'absolute', top: '11%', left: '85%' }}>Eraser</div>
      <div style={{ position: 'absolute', top: '14%', left: '87%', width: '15px', height: '15px', background: 'white', border: '2px solid', }} id="white" onClick={() => color(document.getElementById('white'))} ></div>
      <input type="button" value="rectangle" onClick={drawRectangle} style={{ position: 'absolute', top: '18%', left: '85%' }}></input>
      <input type="button" value="clear" onClick={clearAll} style={{ position: 'absolute', top: '22%', left: '85%' }} />
      <input type="range" min="0" max="20" value={lineWidth} onChange={(e) => { setLineWidth(e.target.value); }} style={{ position: 'absolute', top: '1%', left: '2%' }} id='lineWidthInput' />
    </div>
  );
};

export default App;
   