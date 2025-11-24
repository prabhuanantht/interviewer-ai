import React, { useEffect, useRef } from 'react';

export function AudioVisualizer({ isRecording }) {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = canvas.width;
        let height = canvas.height;

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            if (!isRecording) {
                // Idle state: flat line
                ctx.beginPath();
                ctx.moveTo(0, height / 2);
                ctx.lineTo(width, height / 2);
                ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
                ctx.lineWidth = 2;
                ctx.stroke();
                return;
            }

            // Active state: simulated wave
            const time = Date.now() / 100;
            ctx.beginPath();
            ctx.moveTo(0, height / 2);

            for (let i = 0; i < width; i++) {
                const amplitude = 20;
                const frequency = 0.05;
                const y = height / 2 + Math.sin(i * frequency + time) * amplitude * Math.sin(i * 0.01);
                ctx.lineTo(i, y);
            }

            ctx.strokeStyle = '#6366f1';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#6366f1';

            animationRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isRecording]);

    return (
        <canvas
            ref={canvasRef}
            width={300}
            height={100}
            style={{ width: '100%', height: '100px' }}
        />
    );
}
