'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import MagneticButton from '@/components/MagneticButton'
import { projects } from '@/data/projects'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

export default function ProjectDetailPage({ params }) {
    const { slug } = params
    const project = projects.find(p => p.slug === slug)

    if (!project) {
        notFound()
    }

    // Find next project
    const currentIndex = projects.findIndex(p => p.slug === slug)
    const nextProject = projects[(currentIndex + 1) % projects.length]

    const containerRef = useRef(null)
    const heroImageRef = useRef(null)
    const overlayRef = useRef(null)

    useGSAP(() => {
        const tl = gsap.timeline()

        // Hero Animation
        tl.from(heroImageRef.current, {
            scale: 1.2,
            duration: 1.5,
            ease: "power3.out"
        })
            .to(overlayRef.current, {
                opacity: 1,
                duration: 1
            }, "-=1")

        // Parallax for Hero Image on Scroll
        gsap.to(heroImageRef.current, {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        })

    }, { scope: containerRef })

    return (
        <main ref={containerRef} className="bg-background min-h-screen">
            {/* Navigation Back */}
            {/* Navigation Back - Bottom Right Fixed */}
            <Link
                href="/work"
                className="fixed bottom-8 right-6 z-[90] mix-blend-difference text-white flex items-center gap-3 group cursor-pointer"
            >
                <span className="font-mono text-xs uppercase tracking-[0.2em] group-hover:opacity-50 transition-opacity duration-300">All Projects</span>
                <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:scale-90 transition-transform duration-300">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
            </Link>

            {/* Hero Section */}
            <section className="relative h-screen w-full overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        ref={heroImageRef}
                        src={project.images.hero}
                        alt={project.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                <div ref={overlayRef} className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10 opacity-0 bg-gradient-to-t from-black/90 to-transparent pt-32">
                    <div className="container mx-auto">
                        <span className="block text-primary font-mono tracking-widest mb-4">{project.category}</span>
                        <h1 className="text-6xl md:text-9xl font-display font-bold uppercase leading-none mb-8">
                            {project.title}
                        </h1>
                        <div className="flex flex-wrap gap-x-12 gap-y-4 text-sm md:text-base border-t border-white/20 pt-8">
                            <div>
                                <span className="block text-muted mb-1">Client</span>
                                <span className="font-bold">{project.client}</span>
                            </div>
                            <div>
                                <span className="block text-muted mb-1">Year</span>
                                <span className="font-bold">{project.year}</span>
                            </div>
                            <div>
                                <span className="block text-muted mb-1">Service</span>
                                <span className="font-bold">{project.category}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Overview Section */}
            <section className="py-24 md:py-32 container mx-auto px-6">
                <div className="grid md:grid-cols-12 gap-12">
                    <div className="md:col-span-4">
                        <h3 className="text-sm font-mono tracking-widest text-primary mb-8 uppercase">Overview</h3>
                    </div>
                    <div className="md:col-span-8">
                        <p className="text-2xl md:text-4xl leading-tight font-light">
                            {project.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Full Width Detail Image */}
            <section className="w-full h-[60vh] md:h-[80vh] relative my-12 overflow-hidden">
                <ParallaxImage src={project.images.detail1} alt="Project detail" />
            </section>

            {/* Challenge & Solution */}
            <section className="py-24 container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-20">
                    <div>
                        <h3 className="text-3xl font-display font-bold mb-6">The Challenge</h3>
                        <p className="text-muted text-lg leading-relaxed">
                            {project.challenge}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-3xl font-display font-bold mb-6">The Solution</h3>
                        <p className="text-muted text-lg leading-relaxed">
                            {project.solution}
                        </p>
                    </div>
                </div>
            </section>

            {/* Next Project Footer */}
            <section className="border-t border-white/10 mt-20">
                <Link href={`/work/${nextProject.slug}`} className="group block relative h-[50vh] overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={nextProject.images.hero}
                            alt="Next Project"
                            fill
                            className="object-cover opacity-30 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700 ease-out"
                        />
                    </div>
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                        <span className="text-sm font-mono tracking-widest mb-4">Next Project</span>
                        <h2 className="text-5xl md:text-8xl font-display font-bold uppercase group-hover:text-primary transition-colors duration-300">
                            {nextProject.title}
                        </h2>
                        <ArrowRight className="mt-8 w-8 h-8 group-hover:translate-x-4 transition-transform duration-300" />
                    </div>
                </Link>
            </section>
        </main>
    )
}

function ParallaxImage({ src, alt }) {
    const containerRef = useRef(null)
    const imgRef = useRef(null)

    useGSAP(() => {
        gsap.fromTo(imgRef.current,
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
    }, { scope: containerRef })

    return (
        <div ref={containerRef} className="w-full h-full relative overflow-hidden">
            <Image
                ref={imgRef}
                src={src}
                alt={alt}
                fill
                className="object-cover scale-110" // Initial scale to allow parallax movement
            />
        </div>
    )
}
