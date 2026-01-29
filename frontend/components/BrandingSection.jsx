'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function BrandingSection() {
    const containerRef = useRef(null)
    const textColRef = useRef(null)
    const imageColRef = useRef(null)

    useGSAP(() => {
        // Select H2 (inside the wrapper), P, and UL
        const textElements = textColRef.current.querySelectorAll('h2, p, ul')

        // Text Content Reveal
        // use autoAlpha to prevent FOUC but ensure visibility is restored
        gsap.fromTo(textElements,
            { y: 50, autoAlpha: 0 },
            {
                y: 0,
                autoAlpha: 1,
                duration: 1.2,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: textColRef.current,
                    start: "top 85%", // Trigger slightly earlier
                    toggleActions: "play none none reverse"
                }
            }
        )

        // Image Mask Reveal & Scale
        const image = imageColRef.current.querySelector('img') // Select the next/image

        // Initial States (Set immediately to avoid FOUC or delay)
        gsap.set(imageColRef.current, { clipPath: 'inset(100% 0% 0% 0%)' })
        gsap.set(image, { scale: 1.2 })

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: imageColRef.current,
                start: "top 85%", // Trigger earlier (was 75%)
                toggleActions: "play none none reverse"
            }
        })

        tl.to(imageColRef.current, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.5,
            ease: "power4.out"
        })
            .to(image, {
                scale: 1,
                duration: 1.5,
                ease: "power3.out"
            }, "<")

        // Overlay Tag Reveal
        const tag = imageColRef.current.querySelector('.project-tag')
        gsap.fromTo(tag,
            { yPercent: 100, autoAlpha: 0 },
            {
                yPercent: 0,
                autoAlpha: 1,
                duration: 1,
                ease: "power3.out",
                delay: 0.6,
                scrollTrigger: {
                    trigger: imageColRef.current,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }
            }
        )

    }, { scope: containerRef })

    return (
        <section id="about" ref={containerRef} className="py-24 bg-[#0a0a0a] relative overflow-hidden">
            <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Text Content */}
                <div ref={textColRef} className="space-y-8">
                    <div className="overflow-hidden">
                        <h2
                            className="text-5xl md:text-7xl font-display font-bold uppercase leading-none opacity-0 will-change-transform"
                        >
                            Building Brands <br />
                            That Look And <br />
                            <span className="text-primary">Feel Better.</span>
                        </h2>
                    </div>

                    <p
                        className="text-muted text-lg font-light leading-relaxed max-w-xl opacity-0 will-change-transform"
                    >
                        We are a creative consultancy that bridges the gap between artificial intelligence and human creativity. We help forward-thinking companies implement AI solutions that are not just functional, but emotionally resonant and visually stunning.
                    </p>

                    <ul className="space-y-4 pt-4 border-t border-white/10 opacity-0 will-change-transform">
                        {['AI Strategy & Implementation', 'Creative Direction', 'Immersive Web Experiences'].map((item, i) => (
                            <li
                                key={i}
                                className="flex items-center space-x-3 text-white/80"
                            >
                                <div className="w-2 h-2 bg-primary rounded-full" />
                                <span className="tracking-wide uppercase text-sm font-semibold">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Image Content - Mask Reveal */}
                <div className="relative h-[600px] w-full group">
                    <div
                        ref={imageColRef}
                        className="relative w-full h-full"
                        style={{ clipPath: "inset(100% 0 0 0)" }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                        <Image
                            src="/images/branding-image.png"
                            alt="Immagina Creative Studio"
                            fill
                            className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out"
                        />
                        {/* Overlay Project Tag moved inside for relative positioning context if needed, or kept outside but referenced */}
                        <div className="project-tag absolute bottom-8 left-8 z-20 overflow-hidden">
                            <p className="font-display text-4xl uppercase text-white drop-shadow-lg">
                                Next Gen <span className="text-primary">Creators</span>
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}
