'use client'

import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { MoveHorizontal } from 'lucide-react'

export default function CustomCursor() {
    const cursorRef = useRef(null)
    const followerRef = useRef(null)
    const [isMounted, setIsMounted] = React.useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useGSAP(() => {
        if (!isMounted || !cursorRef.current || !followerRef.current) return

        // Move cursor and follower
        const moveCursor = (e) => {
            gsap.to(cursorRef.current, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: "power2.out"
            })
            gsap.to(followerRef.current, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.5, // Slower for magnetic feel
                ease: "power2.out"
            })
        }

        window.addEventListener('mousemove', moveCursor)

        // Hover effects - scale up on interactive elements
        const handleMouseEnter = () => {
            gsap.to([cursorRef.current, followerRef.current], {
                scale: 1.5,
                opacity: 0.5,
                duration: 0.3
            })
        }

        const handleMouseLeave = () => {
            gsap.to([cursorRef.current, followerRef.current], {
                scale: 1,
                opacity: 1,
                duration: 0.3
            })
        }

        // Drag State
        const handleDragEnter = () => {
            gsap.to(cursorRef.current, { scale: 0, duration: 0.3 }) // Hide main dot
            gsap.to(followerRef.current, {
                scale: 3,
                backgroundColor: 'white',
                mixBlendMode: 'difference',
                duration: 0.3
            })
            // Show "DRAG" text (we'll add a ref for it)
            gsap.to('.cursor-text', { opacity: 1, scale: 1, duration: 0.3 })
        }

        const handleDragLeave = () => {
            gsap.to(cursorRef.current, { scale: 1, duration: 0.3 })
            gsap.to(followerRef.current, {
                scale: 1,
                backgroundColor: 'transparent',
                duration: 0.3
            })
            gsap.to('.cursor-text', { opacity: 0, scale: 0.5, duration: 0.3 })
        }

        // Attach listeners to all clickable elements
        const clickables = document.querySelectorAll('a, button, input, textarea, .service-item')
        clickables.forEach(el => {
            el.addEventListener('mouseenter', handleMouseEnter)
            el.addEventListener('mouseleave', handleMouseLeave)
        })

        // Drag listeners
        const dragAreas = document.querySelectorAll('.drag-cursor-area')
        dragAreas.forEach(el => {
            el.addEventListener('mouseenter', handleDragEnter)
            el.addEventListener('mouseleave', handleDragLeave)
        })

        return () => {
            window.removeEventListener('mousemove', moveCursor)
            clickables.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnter)
                el.removeEventListener('mouseleave', handleMouseLeave)
            })
            dragAreas.forEach(el => {
                el.removeEventListener('mouseenter', handleDragEnter)
                el.removeEventListener('mouseleave', handleDragLeave)
            })
        }
    }, [isMounted])

    if (!isMounted) return null

    return (
        <>
            {/* Main Dot */}
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference transform -translate-x-1/2 -translate-y-1/2"
            />
            {/* Follower Ring */}
            <div
                ref={followerRef}
                className="fixed top-0 left-0 w-8 h-8 border border-white rounded-full pointer-events-none z-[9998] mix-blend-difference transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            >
                <span className="cursor-text text-black opacity-0">
                    <MoveHorizontal className="w-4 h-4" />
                </span>
            </div>
        </>
    )
}
