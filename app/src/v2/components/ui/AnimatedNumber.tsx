import { useEffect, useState } from 'react';

export interface AnimatedNumberProps {
    value: number;
    duration?: number;
    className?: string;
    decimals?: number;
}

export default function AnimatedNumber({
    value,
    duration = 1000,
    className = '',
    decimals = 0
}: AnimatedNumberProps) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let startTime: number;
        let animationFrame: number;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            // Easing function (ease-out cubic)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(value * easeOut);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [value, duration]);

    return (
        <span className={className}>
            {displayValue.toFixed(decimals)}
        </span>
    );
}
