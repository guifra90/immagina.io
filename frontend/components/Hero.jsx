'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';

// Dynamic import to avoid hydration errors with R3F
const HeroCanvas = dynamic(() => import('./HeroCanvas'), {
    ssr: false
});

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    const containerRef = useRef(null);
    const marqueeRef = useRef(null);
    const marqueeWrapperRef = useRef(null);
    const textRef = useRef(null);
    const imageRef = useRef(null);

    useGSAP(() => {
        // Reveal Marquee
        gsap.to(marqueeWrapperRef.current, {
            opacity: 0.8,
            duration: 1.5,
            ease: "power2.out",
            delay: 0.5
        });

        // Velocity-based Marquee
        const baseDuration = 100; // Slower base speed
        let activeDuration = baseDuration;

        // Create the infinite loop tween
        const marqueeTween = gsap.to(marqueeRef.current, {
            xPercent: -50,
            repeat: -1,
            duration: 100, // Base speed (adjusted for smoothness)
            ease: "none",
        });

        // Update speed on scroll
        ScrollTrigger.create({
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
                const velocity = Math.abs(self.getVelocity());
                // Map velocity to speed multiplier (Base 1 + boost)
                const speedMultiplier = 1 + (velocity / 100);

                gsap.to(marqueeTween, {
                    timeScale: speedMultiplier,
                    duration: 0.5,
                    overwrite: "auto",
                    ease: "power1.out"
                });

                // Return to base speed
                gsap.to(marqueeTween, {
                    timeScale: 1,
                    duration: 1.5,
                    delay: 0.5,
                    overwrite: "auto",
                    ease: "power2.out"
                });
            }
        });

        // Explicitly ensuring autoAlpha for FOUC prevention
        const textElements = textRef.current.children;
        gsap.set(textElements, { autoAlpha: 0, y: 50 }); // Set initial state immediately

        gsap.to(textElements, {
            y: 0,
            autoAlpha: 1,
            duration: 1.2,
            stagger: 0.1,
            delay: 0.2, // Checkpoint: Reduced delay
            ease: "power3.out"
        });

        // Image Reveal (Slide Up + Scale)
        gsap.set(imageRef.current, { autoAlpha: 0, y: 50, scale: 0.95 });
        gsap.to(imageRef.current, {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
            delay: 0.4
        });

    }, { scope: containerRef });

    return (
        <section
            id="home"
            ref={containerRef}
            className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#2d0b33] to-[#4a0404]"
            style={{
                background: 'linear-gradient(to bottom right, #0f172a, #2d0b33, #4a0404)'
            }}
        >
            {/* 3D Background */}
            <HeroCanvas />

            {/* Gradient Overlay matching VR Image (Dominant Red at Bottom Right) */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#8e44ad]/20 via-[#c0392b]/30 to-[#ff0000]/40 mix-blend-overlay pointer-events-none" />
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />

            {/* Scrolling Marquee Text - Background Layer */}
            <div ref={marqueeWrapperRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] z-0 select-none pointer-events-none rotate-[-6deg] opacity-0">
                <div className="flex overflow-hidden">
                    <div
                        ref={marqueeRef}
                        className="flex whitespace-nowrap will-change-transform transform-gpu"
                    >
                        {/* Duplicated text for seamless loop */}
                        {[...Array(2)].map((_, groupIndex) => (
                            <div key={groupIndex} className="flex">
                                {[...Array(4)].map((_, i) => (
                                    <span key={i} className="text-[25vw] md:text-[20vw] font-display font-light uppercase text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.6)] opacity-40 tracking-widest leading-none pr-[5vw]">
                                        Design That Leaves a Mark •
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="relative z-10 w-full h-full max-w-[1600px] mx-auto px-6 md:px-12">

                {/* Intro Content - Left Aligned */}
                <div className="absolute top-1/2 -translate-y-1/2 left-6 md:left-12 max-w-3xl z-30">
                    <div ref={textRef}>
                        <h2 className="text-white mb-6 will-change-transform flex flex-row items-baseline gap-3 md:gap-5 flex-wrap opacity-0">
                            <span className="font-display font-bold uppercase text-6xl md:text-8xl tracking-tight leading-none">Digital</span>
                            <span className="font-elegant italic font-light text-6xl md:text-8xl text-white/90 leading-none lowercase">soul.</span>
                        </h2>
                        <p
                            className="text-white/90 text-sm md:text-lg font-medium mb-8 leading-relaxed will-change-transform opacity-0"
                        >
                            Non scriviamo solo codice. Plasmiamo anime digitali.<br />Uniamo AI avanzata e design emotivo per creare prodotti che sembrano vivi.
                        </p>

                        <div className="will-change-transform opacity-0">
                            <a href="#contact" className="inline-block bg-white text-[#d63031] px-8 py-3.5 font-bold text-sm tracking-widest hover:bg-gray-100 transition-all uppercase rounded-full shadow-lg">
                                Inizia il Progetto
                            </a>
                        </div>
                    </div>
                </div>

                {/* Hero Image - Bottom Right */}
                <div
                    ref={imageRef}
                    className="absolute bottom-0 right-[-20%] md:right-0 h-[60%] md:h-[85%] w-[140%] md:w-[60%] lg:w-[50%] z-10 flex items-end justify-end pointer-events-none will-change-transform opacity-0"
                >
                    <Image
                        src="/images/hero-vr-glass.png"
                        alt="Futuristic VR Experience"
                        width={900}
                        height={1100}
                        className="object-contain object-bottom w-full h-full"
                        priority
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;
