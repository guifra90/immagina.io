'use client'

import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export default function MagneticButton({ children, className = "" }) {
    const magnetic = useRef(null)

    useGSAP(() => {
        const xTo = gsap.quickTo(magnetic.current, "x", { duration: 1, ease: "elastic.out(1, 0.4)" })
        const yTo = gsap.quickTo(magnetic.current, "y", { duration: 1, ease: "elastic.out(1, 0.4)" })

        const handleMouseMove = (e) => {
            const { clientX, clientY } = e
            const { height, width, left, top } = magnetic.current.getBoundingClientRect()
            const x = clientX - (left + width / 2)
            const y = clientY - (top + height / 2)

            // Move the button based on cursor position relative to center
            xTo(x * 0.35)
            yTo(y * 0.35)
        }

        const handleMouseLeave = () => {
            xTo(0)
            yTo(0)
        }

        magnetic.current.addEventListener("mousemove", handleMouseMove)
        magnetic.current.addEventListener("mouseleave", handleMouseLeave)

        return () => {
            if (magnetic.current) {
                magnetic.current.removeEventListener("mousemove", handleMouseMove)
                magnetic.current.removeEventListener("mouseleave", handleMouseLeave)
            }
        }
    })

    return (
        <div ref={magnetic} className={`relative inline-block ${className}`}>
            {children}
        </div>
    )
}
