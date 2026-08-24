import React, { useEffect, useRef } from 'react';

interface Props {
    text?: string;
    time?: number;
}

const FullPageLoader: React.FC<Props> = ({ text, time }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const loadingText = text || 'Loading...';

    useEffect(() => {
        if (!containerRef.current) return;

        const letters = containerRef.current.querySelectorAll('.loading-letter');

        const animations = Array.from(letters).map((letter, i) =>
            letter.animate(
                [
                    { transform: 'translateY(0)', easing: 'ease-out' },
                    { transform: 'translateY(-15px)', easing: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)' }, // overshoot
                    { transform: 'translateY(0)', easing: 'ease-in' },
                ],
                {
                    duration: time || 1000,
                    iterations: Infinity,
                    delay: i * 120,
                }
            )
        );

        return () => {
            animations.forEach(anim => anim.cancel());
        };
    }, []);

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'white',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <img
                src="/loader.gif"
                alt="Loading..."
                style={{ width: 200, height: 200, objectFit: 'contain', borderRadius: '50%' }}
            />
            <div
                ref={containerRef}
                style={{
                    marginTop: '1rem',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#333',
                    display: 'flex',
                    gap: '0.1em',
                }}
            >
                {loadingText.split('').map((char, i) => (
                    <span key={i} className="loading-letter text-blue-500" style={{ display: 'inline-block' }}>
                        {char}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default FullPageLoader;