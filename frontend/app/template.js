'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Template({ children }) {
    const textRef = useRef(null);
    const containerRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

        // Target all letter spans
        const letters = textRef.current.querySelectorAll('.char');
        // Target shutters
        const shutters = containerRef.current.querySelectorAll('.shutter');

        // 1. Reveal Logo: Staggered Letter Animation
        tl.fromTo(letters,
            { y: 100, opacity: 0, rotateX: -90 }, // Starting state
            {
                y: 0,
                opacity: 1,
                rotateX: 0,
                duration: 0.8,
                stagger: 0.05,
                ease: "back.out(1.7)"
            }
        )
            // 2. Hold briefly
            .to(letters, {
                y: -10,
                duration: 1,
                ease: "none"
            })
            // 3. Dismiss: Letters fade out and move up
            .to(letters, {
                y: -100,
                opacity: 0,
                duration: 0.4,
                stagger: {
                    each: 0.03,
                    from: "end"
                },
                ease: "power2.in"
            }, ">-0.5")
            // 4. Shutters Staggered Reveal
            .to(shutters, {
                yPercent: -100,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.inOut",
                onComplete: () => {
                    ScrollTrigger.refresh()
                }
            }, "-=0.2");
    }, { scope: containerRef });

    const title = "IMMAGINA";

    return (
        <div ref={containerRef}>
            {/* Shutter Overlay */}
            <div className="fixed inset-0 z-[999999] pointer-events-none grid grid-cols-5 h-screen w-full">
                {/* 5 Vertical Shutters - Grid Layout */}
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="shutter relative w-full h-full bg-[#111111]"
                    />
                ))}
            </div>

            {/* Logo Container - Absolute Centered */}
            <div className="fixed inset-0 z-[100001] flex items-center justify-center pointer-events-none">
                <div className="px-4">
                    <h1
                        ref={textRef}
                        className="flex text-4xl md:text-7xl font-display font-bold text-white tracking-tighter uppercase perspective-text"
                    >
                        {title.split('').map((char, index) => (
                            <span key={index} className="char opacity-0 inline-block will-change-transform">
                                {char}
                            </span>
                        ))}
                    </h1>
                </div>
            </div>

            {children}
        </div>
    );
}
