'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const projects = [
    {
        id: 1,
        title: 'Neural Data Core',
        category: 'Data Analytics',
        image: '/images/work-project-1.png',
        size: 'col-span-1 lg:col-span-2',
        color: 'from-cyan-500/80 to-blue-600/80',
        description: 'Visualizing complex neural networks for enterprise analytics.'
    },
    {
        id: 2,
        title: 'Neon Tokyo',
        category: 'E-Commerce Branding',
        image: '/images/work-project-2.png',
        size: 'col-span-1',
        color: 'from-pink-500/80 to-purple-600/80',
        description: 'A cyberpunk-inspired brand identity for a streetwear label.'
    },
    {
        id: 3,
        title: 'Aura Fashion',
        category: 'Web Experience',
        image: '/images/work-project-3.png',
        size: 'col-span-1',
        color: 'from-emerald-500/80 to-teal-600/80',
        description: 'Immersive 3D shopping experience with AR integration.'
    }
]

const ParallaxProject = ({ project, setHoveredProject }) => {
    const containerRef = useRef(null)
    const imageRef = useRef(null)

    useGSAP(() => {
        // Parallax Effect
        gsap.fromTo(imageRef.current,
            { yPercent: -10 },
            {
                yPercent: 10,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            }
        )

        // Reveal Animation (Award Style: Clip Path + Scale)
        // We target the container for clip-path, and the image for initial scale
        gsap.set(containerRef.current, { clipPath: 'inset(100% 0% 0% 0%)' })
        gsap.set(imageRef.current, { scale: 1.2 })

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        })

        tl.to(containerRef.current, {
            clipPath: 'inset(0% 0% 0% 0%)',
            autoAlpha: 1, // Ensure visibility
            y: 0,
            duration: 1.5,
            ease: "power4.out"
        })
            .to(imageRef.current, {
                scale: 1, // Settles to 1 (but parallax yPercent still active)
                duration: 1.5,
                ease: "power3.out"
            }, "<")
    }, { scope: containerRef })

    // Hover Animation for Scale & Skew (Premium feel)
    const handleMouseEnter = () => {
        setHoveredProject(project.id)

        // Scale & Skew Effect
        gsap.to(imageRef.current, {
            scale: 1.1,
            rotation: 2, // Slight tilt
            duration: 0.8,
            ease: "power3.out"
        })
    }

    const handleMouseLeave = () => {
        setHoveredProject(null)
        gsap.to(imageRef.current, {
            scale: 1,
            rotation: 0,
            duration: 0.8,
            ease: "power3.out"
        })
    }

    return (
        <div
            ref={containerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`relative h-[500px] group overflow-hidden bg-gray-900 cursor-pointer ${project.size}`}
        >
            {/* Scroll Parallax Image Container */}
            <div className="absolute inset-0 w-full h-[120%] -top-[10%] will-change-transform">
                <div ref={imageRef} className="relative w-full h-full">
                    <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transition-none" // Disable CSS transition to let GSAP handle it
                    />
                </div>
            </div>

            {/* Overlay Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-t ${project.color} opacity-0 group-hover:opacity-90 transition-opacity duration-700 ease-in-out`} />

            {/* Content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-[0.25,0.1,0.25,1]">
                <span className="text-xs uppercase tracking-widest font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {project.category}
                </span>
                <div className="flex justify-between items-end">
                    <h3 className="text-4xl font-display font-bold uppercase leading-none text-white drop-shadow-md">
                        {project.title}
                    </h3>
                    <div className="bg-white text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                        <ArrowUpRight className="w-6 h-6" />
                    </div>
                </div>

                {/* Reveal Description */}
                <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-700 ease-[0.16,1,0.3,1]">
                    <p className="mt-4 text-white/90 text-sm font-light max-w-sm">
                        {project.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default function WorkSection() {
    const [hoveredProject, setHoveredProject] = useState(null)
    const sectionRef = useRef(null)

    useGSAP(() => {
        // Header Reveal
        const header = sectionRef.current.querySelector('.work-header')
        gsap.fromTo(header,
            { y: 50, autoAlpha: 0 },
            {
                y: 0,
                autoAlpha: 1,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: header,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        )

        // Subheader Reveal
        const sub = sectionRef.current.querySelector('.work-subheader')
        gsap.fromTo(sub,
            { autoAlpha: 0 },
            {
                autoAlpha: 1,
                duration: 1,
                delay: 0.3,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: header, // Sync with header
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        )

    }, { scope: sectionRef })

    return (
        <section id="work" ref={sectionRef} className="py-24 bg-background">
            <div className="container mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-white/10 pb-8">
                    <div className="work-header opacity-0 will-change-transform">
                        <h2 className="text-5xl md:text-8xl font-display font-bold uppercase tracking-tighter">
                            Selected <span className="text-outline-hover text-transparent stroke-white stroke-2">Work</span>
                        </h2>
                    </div>

                    <p
                        className="work-subheader text-muted uppercase tracking-widest text-sm mt-4 md:mt-0 font-bold opacity-0 will-change-transform"
                    >
                        [ Recent Projects 2024-2025 ]
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <ParallaxProject
                            key={project.id}
                            project={project}
                            setHoveredProject={setHoveredProject}
                        />
                    ))}
                </div>

                {/* View All Button */}
                <div className="flex justify-center mt-20">
                    <a
                        href="/work"
                        className="inline-block px-12 py-4 border border-white/20 text-white uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-500 hover:scale-105 active:scale-95 ease-out"
                    >
                        View All Projects
                    </a>
                </div>

            </div>
        </section>
    )
}
