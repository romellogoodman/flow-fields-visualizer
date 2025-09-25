import { useEffect, useRef, useState, useCallback } from 'react';
import { Pane } from 'tweakpane';
import { generateField } from './flow-field';

function App() {
  const canvasRef = useRef(null);
  const paneRef = useRef(null);
  const [currentParticles, setCurrentParticles] = useState(null);

  const [params, setParams] = useState({
    count: 800,
    amplitude: 5.3,
    damping: 0.21,
    scale: 0.8,
    strokeAlpha: 1.0,
    lineWidth: 0.9,
    backgroundColor: '#000000',
    strokeColor: '#ffffff'
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const drawFlowField = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = params.backgroundColor;
      ctx.fillRect(0, 0, width, height);

      const particles = generateField({
        width,
        height,
        count: params.count,
        amplitude: params.amplitude,
        damping: params.damping,
        scale: params.scale,
        seed: Date.now()
      });

      setCurrentParticles(particles);

      const r = parseInt(params.strokeColor.slice(1, 3), 16);
      const g = parseInt(params.strokeColor.slice(3, 5), 16);
      const b = parseInt(params.strokeColor.slice(5, 7), 16);

      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${params.strokeAlpha})`;
      ctx.lineWidth = params.lineWidth;
      ctx.lineCap = 'round';

      particles.forEach(particle => {
        if (particle.line.length > 1) {
          ctx.beginPath();
          ctx.moveTo(particle.line[0][0], particle.line[0][1]);

          for (let i = 1; i < particle.line.length; i++) {
            ctx.lineTo(particle.line[i][0], particle.line[i][1]);
          }

          ctx.stroke();
        }
      });
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFlowField();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [params]);

  const downloadPoints = useCallback(() => {
    if (!currentParticles) {
      console.log('No particles available for download');
      return;
    }

    const data = {
      timestamp: new Date().toISOString(),
      parameters: { ...params },
      particles: currentParticles.map(particle => ({
        startX: particle.x - particle.vx,
        startY: particle.y - particle.vy,
        points: particle.line
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flow-field-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [currentParticles, params]);

  useEffect(() => {
    const pane = new Pane({ title: 'Flow Field Controls' });
    paneRef.current = pane;

    const flowFolder = pane.addFolder({ title: 'Flow Parameters' });
    flowFolder.addBinding(params, 'count', { min: 100, max: 5000, step: 100 });
    flowFolder.addBinding(params, 'amplitude', { min: 1, max: 20, step: 0.1 });
    flowFolder.addBinding(params, 'damping', { min: 0.1, max: 1, step: 0.01 });
    flowFolder.addBinding(params, 'scale', { min: 0.1, max: 3, step: 0.1 });

    const visualFolder = pane.addFolder({ title: 'Visual Settings' });
    visualFolder.addBinding(params, 'strokeAlpha', { min: 0.1, max: 1, step: 0.01 });
    visualFolder.addBinding(params, 'lineWidth', { min: 0.5, max: 5, step: 0.1 });
    visualFolder.addBinding(params, 'backgroundColor');
    visualFolder.addBinding(params, 'strokeColor');

    pane.on('change', () => {
      setParams({ ...params });
    });

    const regenerateButton = pane.addButton({ title: 'Regenerate' });
    regenerateButton.on('click', () => {
      setParams({ ...params });
    });

    const downloadButton = pane.addButton({ title: 'Download Points' });
    downloadButton.on('click', downloadPoints);

    return () => {
      pane.dispose();
    };
  }, [downloadPoints]);

  return (
    <canvas
      ref={canvasRef}
      className="flow-field-canvas"
    />
  );
}

export default App;
