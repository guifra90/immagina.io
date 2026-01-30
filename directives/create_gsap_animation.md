# Creazione Animazioni GSAP

## Obiettivo
Standardizzare la creazione di animazioni usando GSAP per garantire performance ottimali, consistenza visiva e manutenibilità del codice.

## Input
- **Tipo Animazione**: (scroll-trigger, on-load, hover, parallax, velocity-based)
- **Target Element**: Selettore CSS o ref React
- **Timing**: durata, delay, easing
- **Proprietà Animate**: (opacity, x, y, scale, rotate, clipPath, ecc.)

## Pattern di Implementazione

### 1. Setup Base con useGSAP

```javascript
'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Component() {
    const containerRef = useRef(null)
    const elementRef = useRef(null)

    useGSAP(() => {
        // Animazioni qui
    }, { scope: containerRef })

    return (
        <div ref={containerRef}>
            <div ref={elementRef}>Content</div>
        </div>
    )
}
```

### 2. Animazioni On-Load / Reveal

**Pattern**: Fade in + slide up

```javascript
useGSAP(() => {
    // Set initial state (prevent FOUC)
    gsap.set(elementRef.current, { autoAlpha: 0, y: 50 })
    
    gsap.to(elementRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 1.2,
        delay: 0.2,
        ease: "power3.out"
    })
}, { scope: containerRef })
```

**Best Practice**:
- Usare `autoAlpha` invece di `opacity` (gestisce anche `visibility`)
- Impostare `gsap.set()` PRIMA dell'animazione per evitare FOUC
- Easing preferito: `power3.out` o `power4.out` per entrate eleganti

### 3. Scroll-Triggered Animations

**Pattern**: Reveal con ScrollTrigger

```javascript
useGSAP(() => {
    gsap.fromTo(elementRef.current,
        { y: 50, autoAlpha: 0 }, // From
        {
            y: 0,
            autoAlpha: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: elementRef.current,
                start: "top 85%", // Quando top dell'elemento è a 85% viewport
                toggleActions: "play none none reverse"
            }
        }
    )
}, { scope: containerRef })
```

**Parametri ScrollTrigger**:
- `trigger`: elemento che attiva l'animazione
- `start`: quando inizia ("top 85%" = top dell'elemento a 85% della viewport)
- `end`: quando finisce (opzionale)
- `toggleActions`: "onEnter onLeave onEnterBack onLeaveBack"
- `scrub`: true/number per animazione sincronizzata allo scroll

### 4. Clip-Path Mask Reveal

**Pattern**: Wipe reveal con scaling

```javascript
useGSAP(() => {
    const container = containerRef.current
    const image = imageRef.current

    // Initial states
    gsap.set(container, { clipPath: 'inset(100% 0% 0% 0%)' })
    gsap.set(image, { scale: 1.2 })

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    })

    tl.to(container, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.5,
        ease: "power4.out"
    })
    .to(image, {
        scale: 1,
        duration: 1.5,
        ease: "power3.out"
    }, "<") // "<" = start at same time
}, { scope: containerRef })
```

### 5. Parallax Effect

**Pattern**: Vertical parallax su immagini

```javascript
useGSAP(() => {
    gsap.fromTo(imageRef.current,
        { yPercent: -10 },
        {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true // Smooth sync con scroll
            }
        }
    )
}, { scope: containerRef })
```

### 6. Velocity-Based Skew

**Pattern**: Skew basato su velocità scroll (Services Section style)

```javascript
useGSAP(() => {
    const cards = gsap.utils.toArray('.card')
    
    ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
            const velocity = self.getVelocity()
            const skewAmount = gsap.utils.clamp(-5, 5, velocity / 500)
            
            gsap.to(cards, {
                skewX: skewAmount * -1,
                duration: 0.5,
                ease: "power3.out",
                overwrite: "auto"
            })
            
            // Reset dopo un delay
            gsap.to(cards, {
                skewX: 0,
                duration: 0.5,
                delay: 0.3,
                ease: "power3.out",
                overwrite: "auto"
            })
        }
    })
}, { scope: containerRef })
```

### 7. Horizontal Scroll Section

**Pattern**: Pin section e scroll orizzontale (Services style)

```javascript
useGSAP(() => {
    const track = trackRef.current
    
    const getScrollAmount = () => {
        let trackWidth = track.scrollWidth
        return -(trackWidth - window.innerWidth)
    }
    
    gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${getScrollAmount() * -1}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true
        }
    })
}, { scope: sectionRef })
```

## Easing Reference

- **Entrate smooth**: `power3.out`, `power4.out`
- **Elastic/Bounce**: `elastic.out(1, 0.4)` (Magnetic Button)
- **Lineare**: `none` (parallax, scrub animations)
- **Organico**: `power2.inOut`

## Performance Best Practices

1. **Use `will-change-transform`** sui container animati:
   ```jsx
   <div className="will-change-transform">
   ```

2. **Animare solo proprietà performanti**:
   - ✅ `transform` (x, y, scale, rotate)
   - ✅ `opacity`
   - ❌ `width`, `height`, `top`, `left`

3. **Usare `autoAlpha` invece di `opacity`** (gestisce visibility automaticamente)

4. **Set initial states** con `gsap.set()` per evitare FOUC

5. **Cleanup automatico** con `useGSAP` scope

## Casi Limite

### FOUC (Flash of Unstyled Content)
**Sintomo**: Elementi visibili prima dell'animazione
**Soluzione**: Usare `gsap.set()` con `autoAlpha: 0` o classpath iniziale

```javascript
gsap.set(element, { autoAlpha: 0, y: 50 }) // PRIMA dell'animazione
```

### ScrollTrigger non funziona
**Sintomo**: Animazioni non si attivano allo scroll
**Soluzione**: 
- Verificare che `gsap.registerPlugin(ScrollTrigger)` sia chiamato
- Controllare che il trigger element esista nel DOM
- Usare `invalidateOnRefresh: true` per responsive

### Mobile Performance
**Sintomo**: Animazioni lag su mobile
**Soluzione**:
- Usare `ScrollTrigger.matchMedia()` per disabilitare effetti pesanti su mobile
- Ridurre `scrub` value (es. `scrub: 0.5` invece di `scrub: 1`)

## Note
- Tutte le animazioni devono essere testate in Chrome, Safari (iOS), Firefox
- L'easing `power3.out` è lo standard per il brand Immagina.io
- Durata standard: 1.2s per reveal, 0.8s per hover
- Delay tipico: 0.2-0.5s per sequenze staggered

## Lezioni Apprese
- **ScrollTrigger Mobile**: Su iOS Safari, evitare troppi ScrollTrigger simultanei (max 5-6 per sezione)
- **Clip-path performance**: Preferire `inset()` a `polygon()` per performance migliori
