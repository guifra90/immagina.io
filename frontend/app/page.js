'use client'

import React from 'react'
import Hero from '../components/Hero'
import BrandingSection from '../components/BrandingSection'
import WorkSection from '../components/WorkSection'
import ServicesSection from '../components/ServicesSection'
import ContactSection from '../components/ContactSection'
import Footer from '../components/Footer'

export default function Home() {
    return (
        <main className="bg-background min-h-screen text-white selection:bg-primary selection:text-white">
            <Hero />
            <BrandingSection />
            <WorkSection />
            <ServicesSection />
            <ContactSection />
            <Footer />
        </main>
    )
}
