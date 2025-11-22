import { useState, useEffect, useRef } from 'react';

const Interactive3DBox = () => {
    const boxRef = useRef(null);
    const [rotation, setRotation] = useState({ x: -15, y: 25 });
    const [isDragging, setIsDragging] = useState(false);
    const lastMousePos = useRef({ x: 0, y: 0 });
    const velocity = useRef({ x: 0, y: 0.5 }); // Default spin: y-axis clockwise (positive value)
    const requestRef = useRef();

    // Animation Loop
    const animate = () => {
        if (!isDragging) {
            setRotation(prev => ({
                x: prev.x + velocity.current.x,
                y: prev.y + velocity.current.y
            }));

            // Friction (optional, but keeps it spinning forever if removed or very low)
            // To keep it spinning forever, we don't apply friction to the base speed, 
            // but we might want to decay high speeds back to a base speed.
            // For now, let's just let it spin at the current velocity.
        }
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [isDragging]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        lastMousePos.current = { x: e.clientX, y: e.clientY };
        // Stop auto-spin momentarily while dragging to give full control
        velocity.current = { x: 0, y: 0 };
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - lastMousePos.current.x;
        const deltaY = e.clientY - lastMousePos.current.y;

        lastMousePos.current = { x: e.clientX, y: e.clientY };

        // Update rotation immediately for responsiveness
        setRotation(prev => ({
            x: prev.x - deltaY * 0.5, // Invert Y for natural feel
            y: prev.y + deltaX * 0.5
        }));

        // Update velocity for when released (momentum)
        velocity.current = {
            x: -deltaY * 0.1,
            y: deltaX * 0.1
        };
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        // Ensure a minimum spin if it stopped completely, or just let it be
        if (Math.abs(velocity.current.x) < 0.1 && Math.abs(velocity.current.y) < 0.1) {
            velocity.current = { x: 0, y: 0.5 }; // Resume default spin if stopped
        }
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            if (Math.abs(velocity.current.x) < 0.1 && Math.abs(velocity.current.y) < 0.1) {
                velocity.current = { x: 0, y: 0.5 };
            }
        }
    };

    return (
        <div
            className="box-scene"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
            <div
                className="box"
                ref={boxRef}
                style={{
                    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
                }}
            >
                <div className="box-face box-front">
                    <div className="box-content">
                        <span className="box-logo">📦</span>
                        <h2>Stock<br />Master</h2>
                    </div>
                </div>
                <div className="box-face box-back"></div>
                <div className="box-face box-right"></div>
                <div className="box-face box-left"></div>
                <div className="box-face box-top">
                    <div className="box-tape"></div>
                </div>
                <div className="box-face box-bottom">
                    <div className="box-tape"></div>
                </div>
            </div>
        </div>
    );
};

export default Interactive3DBox;
