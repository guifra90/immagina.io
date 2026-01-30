'use client'

import React from 'react'
import Link from 'next/link'
import { Instagram, Twitter, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-[#050505] text-white pt-24 pb-12 border-t border-white/5">
            <div className="container mx-auto px-6">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

                    {/* Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="text-3xl font-display font-bold uppercase tracking-tighter">
                            Immagina.io
                        </Link>
                        <p className="text-muted text-sm leading-relaxed max-w-xs">
                            Blending creativity, strategy, and technology to build brands that leave a mark.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold uppercase tracking-widest mb-6 text-sm">Sitemap</h4>
                        <ul className="space-y-4 text-muted text-sm">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'About', path: '/about' },
                                { name: 'Services', path: '/#services' },
                                { name: 'Work', path: '/work' },
                                { name: 'Insights', path: '/blog' },
                                { name: 'Contact', path: '/#contact' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.path} className="hover:text-primary transition-colors">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Socials */}
                    <div>
                        <h4 className="font-bold uppercase tracking-widest mb-6 text-sm">Socials</h4>
                        <ul className="space-y-4 text-muted text-sm">
                            <li><a href="#" className="hover:text-primary transition-colors">Instagram</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">LinkedIn</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Twitter / X</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Behance</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold uppercase tracking-widest mb-6 text-sm">Let&apos;s Talk</h4>
                        <a href="mailto:hello@immagina.io" className="text-2xl font-display font-bold hover:text-primary transition-colors">
                            hello@immagina.io
                        </a>
                        <p className="mt-4 text-muted text-sm">
                            Via del Design 42,<br />
                            Milano, Italia
                        </p>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5">
                    <p className="text-xs text-muted">
                        © {new Date().getFullYear()} Immagina.io. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="text-muted hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                        <a href="#" className="text-muted hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                        <a href="#" className="text-muted hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
                        <a href="#" className="text-muted hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
                    </div>
                </div>

            </div>
        </footer>
    )
}
