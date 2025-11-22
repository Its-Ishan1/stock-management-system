import useInteractiveBackground from '../hooks/useInteractiveBackground';

const InteractiveBackground = () => {
    const canvasRef = useInteractiveBackground();

    return <canvas ref={canvasRef} id="clothCanvas" />;
};

export default InteractiveBackground;
