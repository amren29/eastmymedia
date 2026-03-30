"use client";

import { useEffect, useState } from 'react';

interface TypewriterProps {
    text: string | string[];
    speed?: number;
    deleteSpeed?: number;
    pause?: number;
    loop?: boolean;
}

export function Typewriter({ text, speed = 100, deleteSpeed = 50, pause = 1500, loop = true }: TypewriterProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(speed);

    useEffect(() => {
        const texts = Array.isArray(text) ? text : [text];
        const i = loopNum % texts.length;
        const fullText = texts[i];

        const handleType = () => {
            setDisplayedText(prev => {
                if (isDeleting) {
                    return fullText.substring(0, prev.length - 1);
                } else {
                    return fullText.substring(0, prev.length + 1);
                }
            });

            // Adjust speed dynamically based on typing state
            if (isDeleting) {
                setTypingSpeed(deleteSpeed);
            } else {
                setTypingSpeed(speed);
            }

            // Finished Typing
            if (!isDeleting && displayedText === fullText) {
                // Pause before deleting
                setTypingSpeed(pause);
                if (loop) {
                    setIsDeleting(true);
                }
            }
            // Finished Deleting
            else if (isDeleting && displayedText === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
                setTypingSpeed(speed);
            }
        };

        const timer = setTimeout(handleType, typingSpeed);
        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, loopNum, speed, deleteSpeed, pause, loop, text, typingSpeed]);

    return <span>{displayedText}</span>;
}
