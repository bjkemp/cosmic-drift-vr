/**
 * Procedurally generates a polygonal space sky texture and applies it to the A-Frame sky element.
 */
function generatePolygonalSpaceSky(width = 2048, height = 1024, starCount = 3000) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Fill background black
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    // Draw polygonal stars
    for (let i = 0; i < starCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 2 + 0.5;
        const sides = Math.floor(Math.random() * 3) + 3; // 3-5 sided polygons
        const brightness = Math.random() * 200 + 55; // avoid too dim
        const color = `rgb(${brightness},${brightness},${brightness})`;

        ctx.beginPath();
        for (let j = 0; j < sides; j++) {
            const angle = (j / sides) * 2 * Math.PI - Math.PI / 2;
            const px = x + radius * Math.cos(angle);
            const py = y + radius * Math.sin(angle);
            if (j === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }

    // Add faceted polygonal gradient overlay for depth
    const grad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/1.2);
    grad.addColorStop(0, 'rgba(20,20,50,0.2)');
    grad.addColorStop(1, 'rgba(0,0,0,0.8)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    return canvas.toDataURL('image/png');
}

window.addEventListener('load', () => {
    const skyEl = document.getElementById('dynamic-sky');
    if (!skyEl) {
        console.warn('No <a-sky> element found with id="dynamic-sky"');
        return;
    }
    const dataURL = generatePolygonalSpaceSky();
    skyEl.setAttribute('src', dataURL);
    console.log('Procedural polygonal space sky applied');
});
