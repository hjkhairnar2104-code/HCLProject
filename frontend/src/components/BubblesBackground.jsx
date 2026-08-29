// Dropping & Floating Dynamic Bubbles Background Canvas Component
function BubblesBackground() {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Color tones for glowing bubbles: Cyan, Indigo, Emerald, Purple, Amber
    const colors = [
      { r: 99, g: 102, b: 241 },   // Indigo
      { r: 16, g: 185, b: 129 },   // Emerald
      { r: 6, g: 182, b: 212 },    // Cyan
      { r: 139, g: 92, b: 246 },   // Purple
      { r: 245, g: 158, b: 11 }    // Amber
    ];

    // Initialize dropping bubble particles
    const bubbleCount = Math.floor(window.innerWidth < 768 ? 25 : 55);
    const bubbles = [];

    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 18 + 6, // 6px to 24px radius
        speedY: Math.random() * 0.8 + 0.35, // Dropping speed
        speedX: (Math.random() - 0.5) * 0.4, // Subtle horizontal sway
        swayAmplitude: Math.random() * 20 + 10,
        swaySpeed: Math.random() * 0.02 + 0.01,
        angle: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.35 + 0.15,
        shimmer: Math.random() * 0.02 + 0.005
      });
    }

    // Interactive mouse interaction
    let mouse = { x: -1000, y: -1000, radius: 120 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      bubbles.forEach(b => {
        // Drop downward
        b.y += b.speedY;
        b.angle += b.swaySpeed;
        b.x += Math.sin(b.angle) * 0.3 + b.speedX;

        // Shimmer opacity
        b.opacity += Math.sin(b.angle * 2) * 0.003;
        if (b.opacity > 0.45) b.opacity = 0.45;
        if (b.opacity < 0.1) b.opacity = 0.1;

        // Reset if dropped past bottom of screen
        if (b.y - b.radius > height) {
          b.y = -b.radius - Math.random() * 40;
          b.x = Math.random() * width;
          b.radius = Math.random() * 18 + 6;
          b.speedY = Math.random() * 0.8 + 0.35;
        }
        if (b.x < -b.radius) b.x = width + b.radius;
        if (b.x > width + b.radius) b.x = -b.radius;

        // Mouse gentle repulsion
        const dx = b.x - mouse.x;
        const dy = b.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          b.x += (dx / dist) * force * 3;
          b.y += (dy / dist) * force * 3;
        }

        // Draw Dropping Bubble with Glass / Gloss Shimmer Effect
        const grad = ctx.createRadialGradient(
          b.x - b.radius * 0.3,
          b.y - b.radius * 0.3,
          b.radius * 0.1,
          b.x,
          b.y,
          b.radius
        );
        grad.addColorStop(0, `rgba(255, 255, 255, ${b.opacity * 1.5})`);
        grad.addColorStop(0.4, `rgba(${b.color.r}, ${b.color.g}, ${b.color.b}, ${b.opacity * 0.8})`);
        grad.addColorStop(1, `rgba(${b.color.r}, ${b.color.g}, ${b.color.b}, 0.03)`);

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Bubble Border Ring
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(${b.color.r}, ${b.color.g}, ${b.color.b}, ${b.opacity * 0.9})`;
        ctx.stroke();

        // Bubble Highlight Reflection (Glass Shimmer)
        ctx.beginPath();
        ctx.arc(b.x - b.radius * 0.35, b.y - b.radius * 0.35, b.radius * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 1.8})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
}

window.BubblesBackground = BubblesBackground;
