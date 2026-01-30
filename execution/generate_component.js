#!/usr/bin/env node

/**
 * Component Generator
 * Descrizione: Genera automaticamente un nuovo componente React seguendo gli standard del progetto
 * Uso: node execution/generate_component.js ComponentName [type]
 * 
 * Tipi supportati:
 * - section (default): Componente section con animazioni GSAP
 * - card: Card component
 * - interactive: Componente con interazioni (hover, click)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const COMPONENTS_DIR = path.join(__dirname, '../frontend/components');

const TEMPLATES = {
    section: (name) => `'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ${name}() {
    const containerRef = useRef(null)

    useGSAP(() => {
        // Animations here
        const elements = containerRef.current.querySelectorAll('.animate-item')
        
        gsap.fromTo(elements,
            { y: 50, autoAlpha: 0 },
            {
                y: 0,
                autoAlpha: 1,
                duration: 1.2,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        )
    }, { scope: containerRef })

    return (
        <section 
            ref={containerRef}
            className="py-24 bg-background"
        >
            <div className="container mx-auto px-6">
                <h2 className="animate-item text-5xl font-display font-bold uppercase mb-8">
                    ${name}
                </h2>
                <p className="animate-item text-muted text-lg max-w-2xl">
                    Description here
                </p>
            </div>
        </section>
    )
}
`,

    card: (name) => `'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'

export default function ${name}({ title, description, image }) {
    const cardRef = useRef(null)

    const handleMouseEnter = () => {
        gsap.to(cardRef.current, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out"
        })
    }

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        })
    }

    return (
        <div
            ref={cardRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 cursor-pointer"
        >
            {image && (
                <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                </div>
            )}
            <h3 className="text-2xl font-display font-bold uppercase mb-2">
                {title}
            </h3>
            <p className="text-muted">
                {description}
            </p>
        </div>
    )
}
`,

    interactive: (name) => `'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export default function ${name}({ children, className = "" }) {
    const elementRef = useRef(null)

    useGSAP(() => {
        const xTo = gsap.quickTo(elementRef.current, "x", { 
            duration: 1, 
            ease: "elastic.out(1, 0.4)" 
        })
        const yTo = gsap.quickTo(elementRef.current, "y", { 
            duration: 1, 
            ease: "elastic.out(1, 0.4)" 
        })

        const handleMouseMove = (e) => {
            const { clientX, clientY } = e
            const { height, width, left, top } = elementRef.current.getBoundingClientRect()
            const x = clientX - (left + width / 2)
            const y = clientY - (top + height / 2)

            xTo(x * 0.35)
            yTo(y * 0.35)
        }

        const handleMouseLeave = () => {
            xTo(0)
            yTo(0)
        }

        elementRef.current?.addEventListener("mousemove", handleMouseMove)
        elementRef.current?.addEventListener("mouseleave", handleMouseLeave)

        return () => {
            if (elementRef.current) {
                elementRef.current.removeEventListener("mousemove", handleMouseMove)
                elementRef.current.removeEventListener("mouseleave", handleMouseLeave)
            }
        }
    })

    return (
        <div ref={elementRef} className={\`relative inline-block \${className}\`}>
            {children}
        </div>
    )
}
`
};

/**
 * Valida il nome del componente
 */
function validateComponentName(name) {
    if (!name) {
        return { valid: false, error: 'Nome componente richiesto' };
    }

    if (!/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
        return { valid: false, error: 'Il nome deve essere in PascalCase (es: MyComponent)' };
    }

    return { valid: true };
}

/**
 * Genera il componente
 */
function generateComponent(name, type = 'section') {
    try {
        // Valida nome
        const validation = validateComponentName(name);
        if (!validation.valid) {
            return { success: false, error: validation.error };
        }

        // Verifica tipo template
        if (!TEMPLATES[type]) {
            return {
                success: false,
                error: `Tipo non valido. Usa: ${Object.keys(TEMPLATES).join(', ')}`
            };
        }

        // Crea directory se non esiste
        if (!fs.existsSync(COMPONENTS_DIR)) {
            fs.mkdirSync(COMPONENTS_DIR, { recursive: true });
        }

        // Path del file
        const filename = `${name}.jsx`;
        const filepath = path.join(COMPONENTS_DIR, filename);

        // Controlla se esiste già
        if (fs.existsSync(filepath)) {
            return {
                success: false,
                error: `Il componente ${filename} esiste già`
            };
        }

        // Genera contenuto
        const content = TEMPLATES[type](name);

        // Scrivi file
        fs.writeFileSync(filepath, content, 'utf8');

        return {
            success: true,
            data: {
                name,
                type,
                path: filepath,
                filename
            }
        };

    } catch (error) {
        return {
            success: false,
            error: error.message,
            stack: error.stack
        };
    }
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
    const name = process.argv[2];
    const type = process.argv[3] || 'section';

    if (!name) {
        console.error('Uso: node generate_component.js <ComponentName> [type]');
        console.error('Tipi: section, card, interactive');
        process.exit(1);
    }

    const result = generateComponent(name, type);
    console.log(JSON.stringify(result, null, 2));

    if (result.success) {
        console.log(`\n✅ Componente creato: ${result.data.path}`);
    }

    process.exit(result.success ? 0 : 1);
}

export { generateComponent };
