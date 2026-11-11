// Adapted with permission from Kirill Kulinkin's Cartridge Club (eb0305f),
// index.html function fu: https://github.com/k5302964-sketch/portfolio
export function makeWoodGrain() {
  const canvas = document.createElement('canvas');
  const size = 512;
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  let seed = 3;
  const next = () => {
    seed = seed * 16807 % 2147483647;
    return seed / 2147483647;
  };
  ctx.fillStyle = '#624030';
  ctx.fillRect(0, 0, size, size);
  for (let line = 0; line < 120; line += 1) {
    ctx.strokeStyle = `rgba(${10 + next() * 30}, ${5 + next() * 15}, 0, ${.08 + next() * .14})`;
    ctx.lineWidth = 1 + next() * 3;
    const y = next() * size;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 32; x <= size; x += 32) {
      ctx.lineTo(x, y + Math.sin(x * .02 + line) * 5);
    }
    ctx.stroke();
  }
  return canvas.toDataURL();
}
