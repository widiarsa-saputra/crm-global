import React, { useEffect, useRef } from "react";

interface SectionLoaderProps {
    text?: string;
    time?: number;
    className?: string;
}

const SectionLoader: React.FC<SectionLoaderProps> = ({
    text = "Loading...",
    time = 1000,
    className = "",
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const letters = containerRef.current.querySelectorAll(".loading-letter");

        const animations = Array.from(letters).map((letter, i) =>
            letter.animate(
                [
                    { transform: "translateY(0)", easing: "ease-out" },
                    {
                        transform: "translateY(-15px)",
                        easing: "cubic-bezier(0.68, -0.55, 0.27, 1.55)", // overshoot
                    },
                    { transform: "translateY(0)", easing: "ease-in" },
                ],
                {
                    duration: time,
                    iterations: Infinity,
                    delay: i * 120,
                }
            )
        );

        return () => animations.forEach((anim) => anim.cancel());
    }, [time, text]);

    return (
        <section
            className={`w-full min-h-[150px] flex flex-col items-center justify-center bg-white ${className}`}
            role="alert"
            aria-live="polite"
        >
            <div
                ref={containerRef}
                className="flex gap-[0.1em] text-blue-600 font-bold text-xl select-none"
            >
                {text.split("").map((char, i) => (
                    <span
                        key={i}
                        className="loading-letter inline-block"
                        aria-hidden="true"
                    >
                        {char}
                    </span>
                ))}
            </div>
        </section>
    );
};

export default SectionLoader;
