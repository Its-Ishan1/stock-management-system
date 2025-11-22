import { useEffect, useRef } from 'react';

const useInteractiveBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const mouse = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            targetX: window.innerWidth / 2,
            targetY: window.innerHeight / 2
        };

        let particles = [];
        let gradientOffset = 0;

        const setupCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createParticles = () => {
            particles = [];
            const particleCount = 50;

            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 3 + 1,
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.5,
                    opacity: Math.random() * 0.5 + 0.2
                });
            }
        };

        const handleMouseMove = (e) => {
            mouse.targetX = e.clientX;
            mouse.targetY = e.clientY;
        };

        const handleResize = () => {
            setupCanvas();
            createParticles();
        };

        const updateParticles = () => {
            particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                const dx = particle.x - mouse.x;
                const dy = particle.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    particle.x += dx * force * 0.1;
                    particle.y += dy * force * 0.1;
                }

                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;
            });
        };

        const drawAnimatedMesh = () => {
            const gridSize = 60;
            const time = Date.now() * 0.001;

            ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
            ctx.lineWidth = 1;

            for (let x = 0; x < canvas.width; x += gridSize) {
                ctx.beginPath();
                for (let y = 0; y < canvas.height; y += 10) {
                    const distanceToMouse = Math.abs(mouse.x - x);
                    const wave = Math.sin(y * 0.01 + time + distanceToMouse * 0.01) * 10;
                    const xPos = x + wave;

                    if (y === 0) {
                        ctx.moveTo(xPos, y);
                    } else {
                        ctx.lineTo(xPos, y);
                    }
                }
                ctx.stroke();
            }

            for (let y = 0; y < canvas.height; y += gridSize) {
                ctx.beginPath();
                for (let x = 0; x < canvas.width; x += 10) {
                    const distanceToMouse = Math.abs(mouse.y - y);
                    const wave = Math.sin(x * 0.01 + time + distanceToMouse * 0.01) * 10;
                    const yPos = y + wave;

                    if (x === 0) {
                        ctx.moveTo(x, yPos);
                    } else {
                        ctx.lineTo(x, yPos);
                    }
                }
                ctx.stroke();
            }
        };

        const draw = () => {
            mouse.x += (mouse.targetX - mouse.x) * 0.1;
            mouse.y += (mouse.targetY - mouse.y) * 0.1;

            const mouseXPercent = mouse.x / canvas.width;
            const mouseYPercent = mouse.y / canvas.height;

            gradientOffset += 0.001;

            const gradient = ctx.createRadialGradient(
                mouse.x, mouse.y, 0,
                mouse.x, mouse.y, canvas.width
            );

            const hue1 = Math.floor(220 + mouseXPercent * 40 + Math.sin(gradientOffset) * 20);
            const hue2 = Math.floor(260 + mouseYPercent * 40 + Math.cos(gradientOffset) * 20);

            gradient.addColorStop(0, `hsla(${hue1}, 70%, 15%, 1)`);
            gradient.addColorStop(0.5, `hsla(${hue2}, 60%, 12%, 1)`);
            gradient.addColorStop(1, 'hsla(220, 50%, 8%, 1)');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            drawAnimatedMesh();

            particles.forEach(particle => {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(139, 92, 246, ${particle.opacity})`;
                ctx.fill();

                particles.forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });

            const glowGradient = ctx.createRadialGradient(
                mouse.x, mouse.y, 0,
                mouse.x, mouse.y, 200
            );
            glowGradient.addColorStop(0, 'rgba(99, 102, 241, 0.15)');
            glowGradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.05)');
            glowGradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

            ctx.fillStyle = glowGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };

        const animate = () => {
            updateParticles();
            draw();
            animationFrameId = requestAnimationFrame(animate);
        };

        setupCanvas();
        createParticles();
        animate();

        document.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            document.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return canvasRef;
};

export default useInteractiveBackground;
