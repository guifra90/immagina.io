'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

export default function BlogPostClient({ data, children }) {
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
            .fromTo(overlayRef.current, {
                opacity: 0,
                y: 50
            }, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out"
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
        <main ref={containerRef} className="bg-background min-h-screen text-white">
            {/* Navigation Back - Bottom Right Fixed */}
            <Link
                href="/blog"
                className="fixed bottom-8 right-6 z-[90] mix-blend-difference text-white flex items-center gap-3 group cursor-pointer"
            >
                <span className="font-mono text-xs uppercase tracking-[0.2em] group-hover:opacity-50 transition-opacity duration-300">All Posts</span>
                <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:scale-90 transition-transform duration-300">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
            </Link>

            {/* Hero */}
            <header className="relative h-[60vh] min-h-[400px] w-full flex items-end pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        ref={heroImageRef}
                        src={data.image}
                        alt={data.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                </div>

                <div ref={overlayRef} className="container mx-auto px-6 relative z-10">
                    <div className="flex gap-4 text-primary font-mono text-sm tracking-widest uppercase mb-4">
                        <span>{data.category}</span>
                        <span>•</span>
                        <span>{data.date}</span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-display font-bold uppercase leading-tight max-w-4xl">
                        {data.title}
                    </h1>
                </div>
            </header>

            {/* Content */}
            <article className="container mx-auto px-6 py-20">
                <div className="grid md:grid-cols-12 gap-8">
                    <div className="md:col-span-3">
                        <div className="sticky top-32">
                            <span className="block text-sm font-mono text-muted mb-2">Author</span>
                            <span className="block font-bold text-lg mb-8">{data.author}</span>

                            <span className="block text-sm font-mono text-muted mb-2">Tags</span>
                            <div className="flex flex-wrap gap-2">
                                {data.tags && data.tags.map(tag => (
                                    <span key={tag} className="text-xs border border-white/20 px-2 py-1 rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-8 md:col-start-5 prose prose-invert prose-lg max-w-none">
                        {children}
                    </div>
                </div>
            </article>
        </main>
    )
}
