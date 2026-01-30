# Creazione Componenti Interattivi

## Obiettivo
Standardizzare la creazione di componenti interattivi premium (Custom Cursor, Magnetic Buttons, Hover Effects) per garantire coerenza nell'esperienza utente.

## Input
- **Tipo Interazione**: (magnetic, cursor-follower, hover-scale, drag-aware)
- **Target Element**: Componente React o CSS selector
- **Behavior**: Descrizione del comportamento desiderato
- **Performance Requirements**: Mobile-friendly? Desktop-only?

## Pattern di Implementazione

### 1. Magnetic Button

**Use Case**: Bottoni che "attraggono" il cursore

**Implementazione**:
```javascript
'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export default function MagneticButton({ children, className = "" }) {
    const magnetic = useRef(null)

    useGSAP(() => {
        const xTo = gsap.quickTo(magnetic.current, "x", { 
            duration: 1, 
            ease: "elastic.out(1, 0.4)" 
        })
        const yTo = gsap.quickTo(magnetic.current, "y", { 
            duration: 1, 
            ease: "elastic.out(1, 0.4)" 
        })

        const handleMouseMove = (e) => {
            const { clientX, clientY } = e
            const { height, width, left, top } = magnetic.current.getBoundingClientRect()
            const x = clientX - (left + width / 2)
            const y = clientY - (top + height / 2)

            xTo(x * 0.35) // Strength: 0.35 = 35% del movimento
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
```

**Utilizzo**:
```jsx
<MagneticButton>
    <button className="px-8 py-4 bg-white text-black">
        Click Me
    </button>
</MagneticButton>
```

**Parametri Chiave**:
- `duration: 1` = velocità del movimento
- `ease: "elastic.out(1, 0.4)"` = effetto elastico
- `x * 0.35` = forza magnetica (0.2-0.5 range ideale)

### 2. Custom Cursor

**Use Case**: Cursore personalizzato che reagisce agli elementi interattivi

**Stati del Cursore**:
1. **Default**: Dot + follower ring
2. **Hover Interactive**: Scale up + fade
3. **Drag Area**: Mostra icona di drag

**Implementazione Base**:
```javascript
'use client'

import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export default function CustomCursor() {
    const cursorRef = useRef(null)
    const followerRef = useRef(null)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => setIsMounted(true), [])

    useGSAP(() => {
        if (!isMounted) return

        // Movimento base
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
                duration: 0.5, // Slower for lag effect
                ease: "power2.out"
            })
        }

        window.addEventListener('mousemove', moveCursor)

        // Hover su elementi cliccabili
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

        // Attach to clickables
        const clickables = document.querySelectorAll('a, button, input, textarea')
        clickables.forEach(el => {
            el.addEventListener('mouseenter', handleMouseEnter)
            el.addEventListener('mouseleave', handleMouseLeave)
        })

        return () => {
            window.removeEventListener('mousemove', moveCursor)
            clickables.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnter)
                el.removeEventListener('mouseleave', handleMouseLeave)
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
                className="fixed top-0 left-0 w-8 h-8 border border-white rounded-full pointer-events-none z-[9998] mix-blend-difference transform -translate-x-1/2 -translate-y-1/2"
            />
        </>
    )
}
```

**Best Practices**:
- **Mobile**: Disabilitare su touch devices (il cursore non ha senso)
- **Z-index**: Sempre 9999 per stare sopra tutto
- **mix-blend-mode**: `difference` per visibilità universale
- **pointer-events**: `none` per non bloccare click

### 3. Hover Scale Effect

**Use Case**: Componenti che crescono al hover

**Pattern Semplice (CSS)**:
```jsx
<div className="transition-transform duration-300 hover:scale-105 active:scale-95">
    Content
</div>
```

**Pattern Avanzato (GSAP)**:
```javascript
const handleMouseEnter = () => {
    gsap.to(imageRef.current, {
        scale: 1.1,
        rotation: 2, // Leggera rotazione
        duration: 0.8,
        ease: "power3.out"
    })
}

const handleMouseLeave = () => {
    gsap.to(imageRef.current, {
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: "power3.out"
    })
}
```

### 4. Scroll-Aware Cursor

**Use Case**: Cursore che cambia in aree scrollabili (es. horizontal scroll)

```javascript
const handleDragEnter = () => {
    gsap.to(cursorRef.current, { scale: 0, duration: 0.3 })
    gsap.to(followerRef.current, {
        scale: 3,
        backgroundColor: 'white',
        duration: 0.3
    })
    // Show drag icon
    gsap.to('.cursor-text', { opacity: 1, duration: 0.3 })
}

// Attach to drag areas
const dragAreas = document.querySelectorAll('.drag-cursor-area')
dragAreas.forEach(el => {
    el.addEventListener('mouseenter', handleDragEnter)
    el.addEventListener('mouseleave', handleDragLeave)
})
```

## Responsive Considerations

### Desktop Only Components

Molti effetti interattivi devono essere disabilitati su mobile:

```javascript
// Check if touch device
const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export default function CustomCursor() {
    if (isTouchDevice()) return null
    // ... resto del componente
}
```

### Responsive Magnetic Effect

```javascript
useGSAP(() => {
    // Disable on mobile
    if (window.innerWidth < 768) return
    
    // ... magnetic logic
})
```

## Performance Best Practices

1. **Use `will-change`** per proprietà animate:
```jsx
<div className="will-change-transform">
```

2. **Throttle mouse events** se necessario (non sempre richiesto con GSAP):
```javascript
import { throttle } from 'lodash'

const moveCursor = throttle((e) => {
    // ... movement logic
}, 16) // ~60fps
```

3. **Cleanup listeners** sempre nel return di useGSAP/useEffect

4. **Lazy mount** cursor component (useEffect + useState)

## Accessibility

⚠️ **Importante**: Gli effetti visivi non devono compromettere l'accessibilità

1. **Mantieni gli stati `:focus`** per keyboard navigation
2. **Non sostituire il cursore di sistema** per utenti con bisogni speciali
3. **Usa `prefers-reduced-motion`** per disabilitare animazioni:

```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (!prefersReducedMotion) {
    // Apply animations
}
```

## Casi Limite

### Cursor scompare su certe aree
**Sintomo**: Il cursore custom non appare in alcune zone
**Soluzione**: Verificare z-index e `pointer-events: none` sul cursor

### Lag sul movimento
**Sintomo**: Il cursore si muove a scatti
**Soluzione**: 
- Ridurre la `duration` (0.1s per main, 0.3-0.5s per follower)
- Verificare che non ci siano troppi elementi ascoltati

### Mobile mostra cursore desktop
**Sintomo**: Cursor visibile su touch devices
**Soluzione**: Early return con check `if (isTouchDevice()) return null`

## Testing Checklist

- [ ] Funziona su Chrome, Safari, Firefox?
- [ ] Disabilitato correttamente su mobile?
- [ ] Non interferisce con l'usabilità degli input?
- [ ] Gli hover states sono visivamente chiari?
- [ ] C'è feedback visivo per tutte le azioni?
- [ ] L'effetto magnetico ha la giusta intensità (non troppo forte)?

## Note
- Il cursore custom aggiunge ~2-5KB al bundle
- Effetti magnetici funzionano meglio su bottoni grandi (min 100px)
- Testare sempre con mouse trackball/trackpad (comportamenti diversi)
