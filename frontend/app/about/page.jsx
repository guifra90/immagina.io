'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const team = [
    {
        name: "Elena Rossi",
        role: "Creative Director",
        image: "/images/team-1.png"
    },
    {
        name: "Marco Chen",
        role: "Lead Developer",
        image: "/images/team-2.png"
    },
    {
        name: "Sarah Kline",
        role: "Strategy Lead",
        image: "/images/team-3.png"
    }
]

const awards = [
    { name: "Site of the Day", org: "Awwwards", year: "2024" },
    { name: "Developer Award", org: "Awwwards", year: "2024" },
    { name: "FWA of the Month", org: "FWA", year: "2023" },
    { name: "Best UI Design", org: "CSS Design Awards", year: "2023" }
]

export default function AboutPage() {
    const containerRef = useRef(null)
    const headerRef = useRef(null)
    const philosophyRef = useRef(null)

    useGSAP(() => {
        // Header Reveal
        const splitText = headerRef.current.innerText.split('')
        // Note: For real split text I'd use a library or manual span wrapping.
        // For simplicity here, just fade up the block.
        gsap.from(headerRef.current, {
            y: 100,
            opacity: 0,
            duration: 1.5,
            ease: "power4.out",
            delay: 0.2
        })

        // Philosophy Section Parallax
        gsap.fromTo('.philosophy-img',
            { yPercent: -15 },
            {
                yPercent: 15,
                ease: "none",
                scrollTrigger: {
                    trigger: philosophyRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            }
        )

        // Team Stagger
        gsap.from('.team-member', {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.team-grid',
                start: "top 80%"
            }
        })

    }, { scope: containerRef })

    return (
        <main ref={containerRef} className="bg-background min-h-screen pt-32 pb-20 overflow-hidden">

            {/* Hero */}
            <section className="container mx-auto px-6 mb-32 md:mb-48">
                <h1 ref={headerRef} className="text-[10vw] leading-[0.9] font-display font-bold uppercase tracking-tight">
                    We Orchestrate<br />
                    <span className="text-primary ml-[15vw]">Chaos</span> Into<br />
                    Design.
                </h1>
            </section>

            {/* Philosophy */}
            <section ref={philosophyRef} className="container mx-auto px-6 mb-40">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-lg">
                        <Image
                            src="/images/about-philosophy.png"
                            alt="Philosophy Abstract"
                            fill
                            className="object-cover philosophy-img scale-125"
                        />
                    </div>
                    <div>
                        <h2 className="text-4xl font-display font-bold uppercase mb-8">Our Philosophy</h2>
                        <p className="text-xl md:text-2xl text-muted leading-relaxed font-light mb-8">
                            In a digital world saturated with noise, clarity is the ultimate luxury.
                            We believe that true innovation happens at the intersection of discipline and creativity.
                        </p>
                        <p className="text-xl md:text-2xl text-muted leading-relaxed font-light">
                            We don&apos;t just build websites; we build digital ecosystems that breathe, react, and evolve.
                            Every pixel has a purpose, every animation tells a story.
                        </p>
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="container mx-auto px-6 mb-40">
                <h2 className="text-sm font-mono tracking-widest text-primary uppercase mb-12">The Minds</h2>
                <div className="grid md:grid-cols-3 gap-8 team-grid">
                    {team.map((member, index) => (
                        <div key={index} className="team-member group">
                            <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-white/5 grayscale group-hover:grayscale-0 transition-all duration-700 ease-out">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-500" />
                            </div>
                            <h3 className="text-2xl font-display font-bold uppercase">{member.name}</h3>
                            <p className="text-primary font-mono text-sm tracking-wider mt-1">{member.role}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Awards */}
            <section className="container mx-auto px-6 mb-20">
                <div className="border-t border-white/20 pt-20">
                    <div className="grid md:grid-cols-12 gap-8">
                        <div className="md:col-span-4">
                            <h2 className="text-4xl font-display font-bold uppercase">Recognition</h2>
                        </div>
                        <div className="md:col-span-8">
                            <ul className="flex flex-col">
                                {awards.map((award, index) => (
                                    <li key={index} className="flex justify-between items-center py-6 border-b border-white/10 group hover:border-primary/50 transition-colors">
                                        <span className="text-xl md:text-2xl group-hover:text-primary transition-colors">{award.name}</span>
                                        <div className="flex gap-8 text-muted font-mono text-sm">
                                            <span>{award.org}</span>
                                            <span>{award.year}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    )
}
