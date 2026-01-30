'use client'

import React, { useState, useRef } from 'react'
import { Send, CheckCircle } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MagneticButton from './MagneticButton'

gsap.registerPlugin(ScrollTrigger)

export default function ContactSection() {
    const [formState, setFormState] = useState('idle') // idle, submitting, success
    const containerRef = useRef(null)
    const formRef = useRef(null)
    const textRef = useRef(null)

    const handleSubmit = (e) => {
        e.preventDefault()
        setFormState('submitting')
        setTimeout(() => {
            setFormState('success')
        }, 1500)
    }

    useGSAP(() => {
        // Text Stagger
        const textElements = textRef.current.children
        gsap.fromTo(textElements,
            { y: 50, autoAlpha: 0 },
            {
                y: 0,
                autoAlpha: 1,
                duration: 1.2,
                stagger: 0.1,
                ease: "power3.out", // Slightly softer than power4
                scrollTrigger: {
                    trigger: textRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        )

        // Form Slide In - Unifying to vertical slide for consistency "Elegant" feel
        gsap.fromTo(formRef.current,
            { y: 50, autoAlpha: 0 },
            {
                y: 0,
                autoAlpha: 1,
                duration: 1.2,
                delay: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: textRef.current, // Sync with text
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        )

    }, { scope: containerRef })

    return (
        <section id="contact" ref={containerRef} className="py-24 bg-background relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none will-change-transform" />

            <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">

                {/* Text Content */}
                <div ref={textRef} className="flex flex-col justify-center">
                    <h2
                        className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter mb-8 opacity-0 will-change-transform"
                    >
                        Trasformiamo <br />
                        La Tua <span className="text-transparent stroke-white stroke-2">Visione.</span>
                    </h2>

                    <p
                        className="text-muted text-lg font-light leading-relaxed max-w-md mb-12 opacity-0 will-change-transform"
                    >
                        Hai un progetto ambizioso? Siamo pronti ad ascoltare. Accettiamo nuove sfide per il prossimo trimestre. Parliamo di come l&apos;AI può far scalare il tuo business.
                    </p>

                    <div className="opacity-0 will-change-transform">
                        <h4 className="font-bold uppercase tracking-widest mb-6 text-sm text-white/50">Direct Connection</h4>
                        <div className="flex flex-col items-start gap-4">
                            <MagneticButton>
                                <a href="mailto:hello@immagina.io" className="text-2xl md:text-3xl font-display uppercase hover:text-primary transition-colors inline-block">
                                    hello@immagina.io
                                </a>
                            </MagneticButton>
                            <MagneticButton>
                                <a href="tel:+390212345678" className="text-xl font-light text-white/80 hover:text-white transition-colors inline-block">
                                    +39 02 1234 5678
                                </a>
                            </MagneticButton>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div
                    ref={formRef}
                    className="bg-white/5 backdrop-blur-sm p-8 md:p-10 rounded-2xl border border-white/10 opacity-0 will-change-transform"
                >
                    {formState === 'success' ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-20 space-y-6">
                            <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-display font-bold uppercase">Message Received</h3>
                            <p className="text-muted">We&apos;ll get back to you within 24 hours.</p>
                            <button
                                onClick={() => setFormState('idle')}
                                className="text-sm uppercase tracking-widest border-b border-primary text-primary pb-1 hover:text-white hover:border-white transition-colors"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-muted ml-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:bg-white/10 transition-all duration-300 placeholder:text-white/20"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-muted ml-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:bg-white/10 transition-all duration-300 placeholder:text-white/20"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-muted ml-1">Message</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:bg-white/10 transition-all duration-300 placeholder:text-white/20 resize-none"
                                    placeholder="Tell us about your project..."
                                />
                            </div>

                            <div className="mt-4">
                                <MagneticButton className="w-full">
                                    <button
                                        type="submit"
                                        disabled={formState === 'submitting'}
                                        className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded-lg hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center space-x-2"
                                    >
                                        <span>{formState === 'submitting' ? 'Sending...' : 'Send Message'}</span>
                                        {formState !== 'submitting' && <Send className="w-4 h-4" />}
                                    </button>
                                </MagneticButton>
                            </div>
                        </form>
                    )}
                </div>

            </div>
        </section>
    )
}
