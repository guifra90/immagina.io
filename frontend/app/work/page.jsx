'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowUpRight } from 'lucide-react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '@/data/projects'
import MagneticButton from '@/components/MagneticButton'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

export default function WorkPage() {
    const containerRef = useRef(null)
    const titleRef = useRef(null)

    useGSAP(() => {
        // Title reveal
        gsap.from(titleRef.current, {
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: "power4.out",
            delay: 0.2
        })

        // Staggered list reveal
        gsap.from('.project-item', {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
            delay: 0.5
        })

    }, { scope: containerRef })

    return (
        <main ref={containerRef} className="bg-background min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-6">

                {/* Header */}
                <header className="mb-20 md:mb-32">
                    <h1 ref={titleRef} className="text-[12vw] leading-[0.85] font-display font-bold uppercase tracking-tight">
                        Selected<br />
                        <span className="text-primary ml-[10vw]">Work</span>
                    </h1>
                </header>

                {/* Project List */}
                <div className="flex flex-col gap-20 md:gap-32">
                    {projects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>
            </div>
        </main>
    )
}

function ProjectCard({ project, index }) {
    const cardRef = useRef(null)
    const imageContainerRef = useRef(null)
    const imageRef = useRef(null)
    const cursorRef = useRef(null)

    useGSAP(() => {
        // Parallax effect on image
        gsap.fromTo(imageRef.current,
            { scale: 1.2 },
            {
                scale: 1,
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            }
        )
    }, { scope: cardRef })

    const handleMouseEnter = () => {
        gsap.to(cursorRef.current, { scale: 1, duration: 0.3, ease: "power2.out" })
    }

    const handleMouseLeave = () => {
        gsap.to(cursorRef.current, { scale: 0, duration: 0.3, ease: "power2.out" })
    }

    const handleMouseMove = (e) => {
        const { left, top, width, height } = cardRef.current.getBoundingClientRect()
        const x = e.clientX - left
        const y = e.clientY - top

        gsap.to(cursorRef.current, {
            x: x,
            y: y,
            duration: 0.1, // Laggy follow
            ease: "power2.out"
        })
    }

    return (
        <Link href={`/work/${project.slug}`} className="group block project-item w-full" >
            <article
                ref={cardRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                className="relative cursor-none" // Custom cursor area
            >
                {/* Custom Cursor Follower within card */}
                <div
                    ref={cursorRef}
                    className="fixed pointer-events-none z-50 w-24 h-24 bg-primary rounded-full flex items-center justify-center text-black font-bold uppercase text-sm mix-blend-difference scale-0 origin-center"
                    style={{ left: 0, top: 0, pointerEvents: 'none', position: 'absolute' }}
                >
                    View
                </div>

                <div className="grid md:grid-cols-12 gap-8 items-center">
                    {/* Project Info - Desktop Left/Right alternation could be cool, sticking to clean left align for now */}
                    <div className="md:col-span-4 flex flex-col gap-4 order-2 md:order-1">
                        <span className="text-primary font-mono text-sm tracking-widest">0{index + 1} / {project.category}</span>
                        <h2 className="text-4xl md:text-6xl font-display font-bold uppercase group-hover:text-primary transition-colors duration-300">
                            {project.title}
                        </h2>
                        <ul className="flex flex-wrap gap-4 text-sm text-muted">
                            <li>{project.year}</li>
                            <li>{project.client}</li>
                        </ul>
                        <div className="mt-4 md:hidden">
                            <MagneticButton>
                                View Case Study <ArrowUpRight className="ml-2 w-4 h-4" />
                            </MagneticButton>
                        </div>
                    </div>

                    {/* Project Image */}
                    <div className="md:col-span-8 order-1 md:order-2">
                        <div
                            ref={imageContainerRef}
                            className="relative aspect-[16/9] md:aspect-[16/10] overflow-hidden rounded-lg bg-white/5"
                        >
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                            <Image
                                ref={imageRef}
                                src={project.images.hero}
                                alt={project.title}
                                fill
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    )
}
