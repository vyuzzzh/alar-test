const canvas = document.querySelector('.canvas-big');
const smallCanvas = document.querySelector('.canvas-small');
const ctx = canvas.getContext('2d');

const drawStar = (cx, cy, spikes, outerRadius, innerRadius, color) => {
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.strokeStyle = '#000';
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i += 1) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
};

drawStar(75, 100, 5, 30, 15, 'red');
drawStar(175, 100, 5, 40, 15, 'blue');
drawStar(125, 200, 5, 50, 15, 'green');
drawStar(225, 200, 5, 45, 25, 'yellow');
drawStar(275, 100, 5, 25, 17, 'black');

canvas.addEventListener('mousedown', (event) => {
  let { x } = event;
  let { y } = event;

  x -= event.target.offsetLeft;
  y -= event.target.offsetTop;
  const pixelData = ctx.getImageData(x, y, 1, 1).data;
  const [r, g, b, a] = pixelData;

  let colorCode = '255, 255, 255';
  if (!((r === 0)
      && (g === 0)
      && (b === 0)
      && (a === 0))) {
    colorCode = `${r}, ${g}, ${b}, ${a}`;
  }
  smallCanvas.style.backgroundColor = `rgb(${colorCode})`;
});
