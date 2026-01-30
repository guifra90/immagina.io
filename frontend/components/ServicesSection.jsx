'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const services = [
    {
        id: '01',
        title: 'Sviluppo AI-Native',
        description: 'Web App, SaaS e piattaforme E-commerce potenziate da LLM. Creiamo software che non solo funziona, ma "pensa" e si adatta.',
        image: '/images/service-ai-native.png'
    },
    {
        id: '02',
        title: 'Strategic Design & UX',
        description: 'Interfacce premiate che convertono. Dal branding all\'architettura dell\'informazione, progettiamo esperienze memorabili per i tuoi utenti.',
        image: '/images/service-ux-vertical.png'
    },
    {
        id: '03',
        title: 'Agenti AI & LLM Custom',
        description: 'Automatizza processi complessi con agenti intelligenti su misura. Dall\'analisi dati al customer service, integriamo la potenza dei Large Language Models nel tuo flusso di lavoro.',
        image: '/images/service-ai-agents.png'
    },
    {
        id: '04',
        title: 'Motion & Creative Tech',
        description: 'Il statico è noioso. Diamo vita al tuo brand con animazioni fluide, 3D interattivo e micro-interazioni che catturano l\'attenzione.',
        image: '/images/service-motion-tech.png'
    }
]

export default function ServicesSection() {
    const sectionRef = useRef(null)
    const trackRef = useRef(null)
    const resetTimer = useRef(null)

    useGSAP(() => {
        const track = trackRef.current
        const cards = track.querySelectorAll('.service-card')

        ScrollTrigger.matchMedia({
            // Desktop: Horizontal Scroll
            "(min-width: 768px)": function () {
                // Calculate total width to scroll
                const getScrollAmount = () => {
                    let trackWidth = track.scrollWidth;
                    return -(trackWidth - window.innerWidth);
                };

                const tween = gsap.to(track, {
                    x: getScrollAmount,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: () => `+=${getScrollAmount() * -1}`,
                        pin: true,
                        scrub: 1,
                        invalidateOnRefresh: true,
                        onUpdate: (self) => {
                            // Velocity Skew & 3D Rotation
                            const velocity = self.getVelocity();
                            const skewAmount = gsap.utils.clamp(-5, 5, velocity / 500);
                            const rotateAmount = gsap.utils.clamp(-10, 10, velocity / 300);

                            gsap.to(cards, {
                                skewX: skewAmount * -1,
                                rotationY: rotateAmount * -1,
                                duration: 0.5,
                                ease: "power3.out",
                                overwrite: "auto"
                            });

                            if (resetTimer.current) clearTimeout(resetTimer.current);
                            resetTimer.current = setTimeout(() => {
                                gsap.to(cards, {
                                    skewX: 0,
                                    rotationY: 0,
                                    duration: 0.5,
                                    ease: "power3.out",
                                    overwrite: "auto"
                                });
                            }, 100);
                        }
                    }
                });

                // Parallax effect for images inside cards (Desktop Only)
                cards.forEach(card => {
                    const img = card.querySelector('.service-img-container');
                    if (img) {
                        gsap.fromTo(img,
                            { scale: 1.2 },
                            {
                                scale: 1,
                                ease: "none",
                                scrollTrigger: {
                                    trigger: card,
                                    containerAnimation: tween,
                                    start: "left right",
                                    end: "right left",
                                    scrub: true
                                }
                            }
                        )
                    }
                })
            },

            // Mobile: Vertical Stack (Simple Entry)
            "(max-width: 767px)": function () {
                // Ensure track is reset
                gsap.set(track, { x: 0 });

                cards.forEach(card => {
                    gsap.fromTo(card,
                        { y: 50, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.8,
                            scrollTrigger: {
                                trigger: card,
                                start: "top 85%"
                            }
                        }
                    )
                })
            }
        });

    }, { scope: sectionRef })

    return (
        <section id="services" ref={sectionRef} className="relative min-h-screen bg-[#0a0a0a] overflow-hidden py-12 md:py-0">
            {/* Header / Intro Overlay - Desktop Only or Different Mobile Position */}
            <div className="md:absolute top-12 left-6 md:left-12 z-20 pointer-events-none mix-blend-difference mb-8 md:mb-0">
                <h2 className="text-white text-sm font-bold tracking-widest uppercase">
                    / Our Expertise
                </h2>
            </div>

            {/* Progress Indicator - Desktop Only */}
            <div className="hidden md:block absolute bottom-12 left-6 md:left-12 z-20 pointer-events-none mix-blend-difference text-white text-xs font-mono">
                SCROLL TO EXPLORE
            </div>

            {/* Track - Vertical on Mobile, Horizontal on Desktop */}
            <div
                ref={trackRef}
                className="flex flex-col md:flex-row md:h-screen items-center px-6 md:px-0 md:pl-12 md:pr-12 gap-8 md:gap-12 w-full md:w-fit will-change-transform perspective-1000 drag-cursor-area md:cursor-none select-none"
            >
                {/* Intro Card */}
                <div className="service-card flex-shrink-0 w-full md:w-[400px] h-auto md:h-[70vh] flex flex-col justify-end p-8 border border-white/10 rounded-2xl bg-[#111]">
                    <h3 className="text-4xl md:text-6xl font-display font-bold uppercase text-white mb-6 leading-none">
                        Services <br />
                        <span className="text-primary">We Offer</span>
                    </h3>
                    <p className="text-gray-400 text-lg">
                        Comprehensive design solutions for ambitious brands.
                    </p>
                </div>

                {/* Service Cards */}
                {services.map((service) => (
                    <div
                        key={service.id}
                        className="service-card relative flex-shrink-0 w-full md:w-[600px] h-[50vh] md:h-[70vh] rounded-2xl overflow-hidden bg-[#161616] group border border-white/5 hover:border-white/20 transition-colors duration-500"
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="service-img-container absolute inset-0 w-full h-full">
                                <Image
                                    src={service.image}
                                    alt={service.title}
                                    fill
                                    className="object-cover w-full h-full opacity-60 group-hover:opacity-80 transition-opacity duration-700"
                                    sizes="(max-width: 768px) 100vw, 600px"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500" />
                        </div>

                        {/* Content */}
                        <div className="relative h-full flex flex-col justify-between p-6 md:p-12 z-10">
                            <div className="flex justify-between items-start">
                                <span className="text-5xl md:text-8xl font-display font-bold text-white/20 group-hover:text-white/40 transition-colors duration-500">
                                    {service.id}
                                </span>
                                <div className="bg-white/10 p-3 rounded-full backdrop-blur-md group-hover:bg-white group-hover:text-black transition-all duration-300">
                                    <ArrowUpRight className="w-6 h-6" />
                                </div>
                            </div>

                            <div className="transform md:translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 className="text-2xl md:text-5xl font-display font-bold uppercase text-white mb-4 drop-shadow-lg">
                                    {service.title}
                                </h3>
                                <p className="text-gray-200 text-sm md:text-lg max-w-sm opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 drop-shadow-md">
                                    {service.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
// Forced rebuild
