'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function RevealingImage({
    src,
    alt,
    fill = false,
    width,
    height,
    className = "",
    containerClassName = "",
    priority = false,
    ...props
}) {
    const containerRef = useRef(null)
    const imageRef = useRef(null)

    useGSAP(() => {
        // Initial set mechanism to avoid FOUC
        gsap.set(containerRef.current, { clipPath: 'inset(100% 0% 0% 0%)' })
        gsap.set(imageRef.current, { scale: 1.2 })

        // Reveal Animation
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        })

        tl.to(containerRef.current, {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.5,
            ease: "power4.out"
        })
            .to(imageRef.current, {
                scale: 1,
                duration: 1.5,
                ease: "power3.out"
            }, "<") // Run simultaneously

    }, { scope: containerRef })

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden will-change-transform ${containerClassName}`}
        // If fill is true, we usually want container to be w-full h-full, handled by parent or containerClassName
        >
            <Image
                ref={imageRef}
                src={src}
                alt={alt}
                fill={fill}
                width={width}
                height={height}
                priority={priority}
                className={`will-change-transform ${className}`}
                {...props}
            />
        </div>
    )
}
