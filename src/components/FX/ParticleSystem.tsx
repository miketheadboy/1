import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface ParticleSystemRef {
    emitBlood: (x: number, y: number) => void;
    emitSmoke: (x: number, y: number) => void;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: string;
    type: 'blood' | 'smoke';
}

export const ParticleSystem = forwardRef<ParticleSystemRef>((_, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<Particle[]>([]);

    useImperativeHandle(ref, () => ({
        emitBlood: (x: number, y: number) => {
            for (let i = 0; i < 10; i++) {
                particles.current.push({
                    x,
                    y,
                    vx: (Math.random() - 0.5) * 10,
                    vy: (Math.random() - 0.5) * 10,
                    life: 1.0,
                    maxLife: 1.0,
                    size: Math.random() * 5 + 2,
                    color: `rgba(${150 + Math.random() * 50}, 0, 0, 1)`,
                    type: 'blood'
                });
            }
        },
        emitSmoke: (x: number, y: number) => {
            for (let i = 0; i < 5; i++) {
                particles.current.push({
                    x,
                    y,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 1) * 2 - 1, // Upward drift
                    life: 1.0,
                    maxLife: 1.0 + Math.random(),
                    size: Math.random() * 10 + 5,
                    color: `rgba(100, 100, 100, 0.5)`,
                    type: 'smoke'
                });
            }
        }
    }));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const render = () => {
            // Resize canvas to window
            if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            for (let i = particles.current.length - 1; i >= 0; i--) {
                const p = particles.current[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.02;

                if (p.type === 'blood') {
                    p.vy += 0.5; // Gravity
                } else if (p.type === 'smoke') {
                    p.size += 0.2; // Expand
                    p.vx += (Math.random() - 0.5) * 0.1; // Drift
                }

                if (p.life <= 0) {
                    particles.current.splice(i, 1);
                    continue;
                }

                ctx.globalAlpha = p.life;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1.0;

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 9999
            }}
        />
    );
});
