'use client'

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function StarField({ count = 5000 }) {
    const mesh = useRef()

    // Generate random positions and colors for stars
    const { positions, colors, sizes } = useMemo(() => {
        const p = new Float32Array(count * 3)
        const c = new Float32Array(count * 3)
        const s = new Float32Array(count) // Individual sizes

        const colorPalette = [
            new THREE.Color('#ffffff'), // Pure White
            new THREE.Color('#ffeaa7'), // Gold
            new THREE.Color('#ff7675'), // Brand Red
            new THREE.Color('#fd79a8'), // Pink
            new THREE.Color('#a29bfe'), // Soft Purple
            new THREE.Color('#74b9ff'), // Soft Blue
        ]

        for (let i = 0; i < count; i++) {
            // Position - Spread wider for a "galaxy" feel
            p[i * 3] = (Math.random() - 0.5) * 40
            p[i * 3 + 1] = (Math.random() - 0.5) * 40
            p[i * 3 + 2] = (Math.random() - 0.5) * 40

            // Color
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
            // Random luminance variance
            const variance = Math.random() * 0.5 + 0.5
            c[i * 3] = color.r * variance
            c[i * 3 + 1] = color.g * variance
            c[i * 3 + 2] = color.b * variance

            // Size variation
            s[i] = Math.random()
        }
        return { positions: p, colors: c, sizes: s }
    }, [count])

    useFrame((state) => {
        if (!mesh.current) return

        // Slow celestial rotation
        const time = state.clock.getElapsedTime()
        mesh.current.rotation.y = time * 0.005 // Very slow, majestic rotation
        mesh.current.rotation.x = Math.sin(time * 0.05) * 0.02 // Almost imperceptible sway
    })

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={colors.length / 3}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                vertexColors
                sizeAttenuation={true}
                depthWrite={false}
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
                map={null} // Could use a circle texture here but simple points work well for stars
            />
        </points>
    )
}

export default function HeroCanvas() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 10], fov: 60 }} // Further back camera for depth
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
            >
                {/* Reduced density for cleaner "digital dust" look */}
                <StarField count={1500} />
            </Canvas>
        </div>
    )
}
