// Fixed script for SVG drawing tool using pointer events (works with mouse & touch)
const svgCanvas = document.getElementById('drawing-board');
let isDrawing = false;
let currentPath = null;

function getPointerPosition(event) {
  // Use bounding rect to convert client coords to SVG local coords (works without viewBox)
  const rect = svgCanvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

function startDrawing(event) {
  // ignore non-primary buttons (e.g., right-click)
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  isDrawing = true;
  svgCanvas.setPointerCapture?.(event.pointerId);

  const pos = getPointerPosition(event);
  currentPath = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  currentPath.setAttribute('points', `${pos.x},${pos.y}`);
  currentPath.setAttribute('fill', 'none');
  currentPath.setAttribute('stroke', 'black');
  currentPath.setAttribute('stroke-width', '2');
  currentPath.setAttribute('stroke-linecap', 'round');
  currentPath.setAttribute('stroke-linejoin', 'round');
  svgCanvas.appendChild(currentPath);
}

function draw(event) {
  if (!isDrawing || !currentPath) return;
  const pos = getPointerPosition(event);
  // append new point to points attribute
  const points = currentPath.getAttribute('points') || '';
  currentPath.setAttribute('points', `${points} ${pos.x},${pos.y}`);
}

function stopDrawing(event) {
  if (isDrawing) {
    isDrawing = false;
    currentPath = null;
  }
  try { svgCanvas.releasePointerCapture?.(event.pointerId); } catch (e) {}
}

// register pointer events (covers mouse + touch + pen)
svgCanvas.addEventListener('pointerdown', startDrawing);
svgCanvas.addEventListener('pointermove', draw);
svgCanvas.addEventListener('pointerup', stopDrawing);
svgCanvas.addEventListener('pointercancel', stopDrawing);
svgCanvas.addEventListener('pointerleave', stopDrawing);

// Optional: prevent built-in touch actions (like scrolling) while drawing
svgCanvas.style.touchAction = 'none';
