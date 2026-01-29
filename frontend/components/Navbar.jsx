'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

import { Menu, X } from 'lucide-react'

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const toggleMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen)
        // Lock body scroll when menu is open
        document.body.style.overflow = !mobileMenuOpen ? 'hidden' : 'auto'
    }

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-[101] transition-all duration-300 ${isScrolled || mobileMenuOpen ? 'bg-background/90 backdrop-blur-md py-4' : 'bg-transparent py-8'
                    }`}
            >
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <Link href="#home" className="text-2xl font-display font-bold tracking-tighter uppercase text-white hover:text-primary transition-colors z-[102]">
                        IMMAGINA
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8">
                        {['ABOUT', 'SERVICES', 'WORK', 'CONTACT'].map((item) => (
                            <Link
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="text-sm font-sans tracking-widest hover:text-primary transition-colors text-gray-300"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden text-white z-[102] p-2"
                        aria-label="Toggle Menu"
                    >
                        {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 w-screen h-screen z-[100] bg-black/95 backdrop-blur-xl flex flex-col justify-center items-center transition-all duration-500 will-change-transform ${mobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-full pointer-events-none'
                    }`}
            >
                <div className="flex flex-col space-y-8 text-center">
                    {['ABOUT', 'SERVICES', 'WORK', 'CONTACT'].map((item, i) => (
                        <Link
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            onClick={toggleMenu}
                            className="text-4xl font-display font-bold text-white hover:text-primary transition-colors tracking-tighter"
                            style={{
                                transitionDelay: mobileMenuOpen ? `${i * 100}ms` : '0ms',
                                opacity: mobileMenuOpen ? 1 : 0,
                                transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                                transition: 'all 0.5s ease-out'
                            }}
                        >
                            {item}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}
