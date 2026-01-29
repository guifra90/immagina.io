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
        title: 'Brand Identity',
        description: 'We craft distinct visual languages that cut through the noise. Logos, typography, and systems that scale.',
        image: '/images/service-brand.jpg' // Placeholder, will fallback or use color
    },
    {
        id: '02',
        title: 'Digital Experience',
        description: 'Immersive websites and applications designed for impact. We merge performance with "Award-Winning" aesthetics.',
        image: '/images/service-digital.jpg'
    },
    {
        id: '03',
        title: 'Motion & 3D',
        description: 'Static is boring. We bring brands to life with fluid motion, 3D assets, and micro-interactions.',
        image: '/images/service-motion.jpg'
    },
    {
        id: '04',
        title: 'AI Strategy',
        description: 'Future-proofing your business with custom AI integration and generative workflows.',
        image: '/images/service-ai.jpg'
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
                    const img = card.querySelector('.service-img');
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
                        {/* Background Image / Placeholder Gradient */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="service-img absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] w-full h-full" />
                            {/* In real implementation, Image goes here
                             <Image src={service.image} fill className="service-img object-cover opacity-50" />
                             */}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                        </div>

                        {/* Content */}
                        <div className="relative h-full flex flex-col justify-between p-6 md:p-12 z-10">
                            <div className="flex justify-between items-start">
                                <span className="text-5xl md:text-8xl font-display font-bold text-white/5 group-hover:text-white/20 transition-colors duration-500">
                                    {service.id}
                                </span>
                                <div className="bg-white/10 p-3 rounded-full backdrop-blur-md group-hover:bg-white group-hover:text-black transition-all duration-300">
                                    <ArrowUpRight className="w-6 h-6" />
                                </div>
                            </div>

                            <div className="transform md:translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 className="text-2xl md:text-5xl font-display font-bold uppercase text-white mb-4">
                                    {service.title}
                                </h3>
                                <p className="text-gray-300 text-sm md:text-lg max-w-sm opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
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
