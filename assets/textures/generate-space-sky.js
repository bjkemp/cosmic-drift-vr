/**
 * Generates a procedural space sky texture and saves it as space-sky.png
 * Usage: Run this script in a browser environment or with a bundler that supports canvas
 */

function generateSpaceSkyTexture(width = 2048, height = 1024, starCount = 5000) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Fill background black
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);

  // Draw stars
  for (let i = 0; i < starCount; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 1.5 + 0.2;
    const brightness = Math.random() * 255;
    const color = `rgb(${brightness},${brightness},${brightness})`;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Optional: add subtle color gradient for depth
  const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/1.2);
  gradient.addColorStop(0, 'rgba(20,20,50,0.2)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.8)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL('image/png');
}

// Generate and download the texture
function downloadTexture() {
  const dataURL = generateSpaceSkyTexture();
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'space-sky.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Auto-run when script is loaded in browser
window.onload = () => {
  downloadTexture();
  console.log('Procedural space sky texture generated and downloaded as space-sky.png');
};