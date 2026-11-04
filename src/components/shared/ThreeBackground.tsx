import React, { useEffect, useRef } from 'react';

export const ThreeBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const isMobile = width < 768;
    const particleCount = isMobile ? 24 : 50;

    // Tech + YouTube theme colors: Electric cyan, neon blue, tech purple, YouTube crimson/red
    const themeColors = [
      '#00f0ff', // Electric Cyan
      '#0070f3', // Neon Cloud Blue
      '#ff0033', // YouTube Red
      '#8b5cf6', // Cyber Purple
      '#38bdf8', // Sky Blue
    ];

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      type: 'dot' | 'play' | 'code';
    }

    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const typeRand = Math.random();
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
        vy: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
        size: Math.random() * 2.5 + 1.2,
        color: themeColors[Math.floor(Math.random() * themeColors.length)],
        alpha: Math.random() * 0.45 + 0.2,
        type: typeRand > 0.85 ? 'play' : typeRand > 0.7 ? 'code' : 'dot',
      });
    }

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Subtle cyber grid lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = isMobile ? 60 : 80;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Constellation lines & particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0) p1.x = width;
        if (p1.x > width) p1.x = 0;
        if (p1.y < 0) p1.y = height;
        if (p1.y > height) p1.y = 0;

        ctx.fillStyle = p1.color;
        ctx.globalAlpha = p1.alpha;

        if (p1.type === 'play') {
          // YouTube mini wireframe play icon
          const s = p1.size * 2.5;
          ctx.beginPath();
          ctx.moveTo(p1.x - s * 0.6, p1.y - s);
          ctx.lineTo(p1.x + s, p1.y);
          ctx.lineTo(p1.x - s * 0.6, p1.y + s);
          ctx.closePath();
          ctx.strokeStyle = p1.color;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        } else if (p1.type === 'code') {
          // Tech mini </> symbol
          ctx.font = '10px monospace';
          ctx.fillText('</>', p1.x, p1.y);
        } else {
          // Standard glowing particle dot
          ctx.beginPath();
          ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const maxDist = isMobile ? 85 : 125;
          if (dist < maxDist) {
            ctx.strokeStyle = p1.color === '#ff0033' ? 'rgba(255, 0, 51, 0.15)' : 'rgba(0, 240, 255, 0.12)';
            ctx.globalAlpha = (1 - dist / maxDist) * 0.2;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* YouTube Crimson Neon Ambient Glow (Top Right) */}
      <div className="absolute -top-24 right-0 w-[550px] h-[550px] bg-red-600/12 rounded-full blur-[160px] pointer-events-none" />

      {/* Cyber Electric Cyan Ambient Glow (Top Left) */}
      <div className="absolute -top-20 left-10 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[170px] pointer-events-none" />

      {/* Electric Neon Blue Center Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Purple Tech Flare (Bottom) */}
      <div className="absolute -bottom-24 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Canvas */}
      <canvas ref={canvasRef} className="w-full h-full opacity-85" />
    </div>
  );
};
