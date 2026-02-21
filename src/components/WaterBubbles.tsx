import { useEffect, useRef } from "react";

interface Bubble {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
  wobble: number;
  wobbleSpeed: number;
}

const WaterBubbles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let bubbles: Bubble[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const createBubble = (): Bubble => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 100,
      radius: Math.random() * 4 + 1.5,
      speed: Math.random() * 0.6 + 0.2,
      opacity: Math.random() * 0.15 + 0.03,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.005,
    });

    // Initialize bubbles
    for (let i = 0; i < 35; i++) {
      const b = createBubble();
      b.y = Math.random() * canvas.height;
      bubbles.push(b);
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bubbles.forEach((b) => {
        b.y -= b.speed;
        b.wobble += b.wobbleSpeed;
        const wx = Math.sin(b.wobble) * 1.5;

        ctx.beginPath();
        ctx.arc(b.x + wx, b.y, b.radius, 0, Math.PI * 2);
        // Use a teal/water color matching the theme
        ctx.fillStyle = `hsla(185, 45%, 55%, ${b.opacity})`;
        ctx.fill();

        // Tiny highlight
        ctx.beginPath();
        ctx.arc(b.x + wx - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(185, 60%, 80%, ${b.opacity * 1.5})`;
        ctx.fill();

        if (b.y < -b.radius * 2) {
          Object.assign(b, createBubble());
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
};

export default WaterBubbles;
