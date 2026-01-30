# Creazione Sezioni con Scroll Orizzontale

## Obiettivo
Implementare sezioni con scroll orizzontale pinned usando GSAP ScrollTrigger, seguendo il pattern della Services Section.

## Input
- **Contenuto**: Array di elementi da mostrare (cards, immagini, testi)
- **Desktop Behavior**: Horizontal scroll pinned
- **Mobile Behavior**: Vertical stack normale
- **Effetti Extra**: Velocity skew, parallax, ecc.

## Quando Usare
- Portfolio/Gallery con molti progetti
- Services showcase
- Timeline orizzontale
- Feature comparison

## Struttura HTML/JSX

```jsx
<section ref={sectionRef} className="relative min-h-screen bg-background">
    {/* Header fisso */}
    <div className="absolute top-12 left-12 z-20">
        <h2>Section Title</h2>
    </div>

    {/* Track orizzontale */}
    <div
        ref={trackRef}
        className="flex flex-col md:flex-row md:h-screen items-center gap-8 md:gap-12 w-full md:w-fit"
    >
        {/* Intro Card (opzionale) */}
        <div className="flex-shrink-0 w-[400px] h-[70vh]">
            <h3>Intro</h3>
        </div>

        {/* Content Cards */}
        {items.map(item => (
            <div
                key={item.id}
                className="service-card flex-shrink-0 w-[600px] h-[70vh]"
            >
                {item.content}
            </div>
        ))}
    </div>
</section>
```

## Implementazione GSAP

### Setup Base

```javascript
'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function HorizontalScrollSection() {
    const sectionRef = useRef(null)
    const trackRef = useRef(null)

    useGSAP(() => {
        const track = trackRef.current

        ScrollTrigger.matchMedia({
            // Desktop: Horizontal Scroll
            "(min-width: 768px)": function () {
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
            },

            // Mobile: Vertical Stack
            "(max-width: 767px)": function () {
                gsap.set(track, { x: 0 }) // Reset
            }
        })
    }, { scope: sectionRef })

    return (
        <section ref={sectionRef}>
            <div ref={trackRef}>
                {/* Content */}
            </div>
        </section>
    )
}
```

### Parametri Chiave

- `getScrollAmount()`: Calcola quanto scrollare (width totale - viewport)
- `start: "top top"`: Pin quando la sezione tocca il top
- `end: +=${amount}`: Durata dello scroll (basato su width)
- `scrub: 1`: Smooth sync con scroll (0.5-2 range)
- `invalidateOnRefresh: true`: Ricalcola su resize

## Effetti Addizionali

### 1. Velocity-Based Skew

Skew delle card basato sulla velocità di scroll:

```javascript
useGSAP(() => {
    const cards = track.querySelectorAll('.service-card')
    const resetTimer = useRef(null)

    ScrollTrigger.matchMedia({
        "(min-width: 768px)": function () {
            const tween = gsap.to(track, {
                // ... horizontal scroll setup
                scrollTrigger: {
                    // ... config
                    onUpdate: (self) => {
                        const velocity = self.getVelocity()
                        const skewAmount = gsap.utils.clamp(-5, 5, velocity / 500)

                        gsap.to(cards, {
                            skewX: skewAmount * -1,
                            duration: 0.5,
                            ease: "power3.out",
                            overwrite: "auto"
                        })

                        // Reset dopo pause
                        if (resetTimer.current) clearTimeout(resetTimer.current)
                        resetTimer.current = setTimeout(() => {
                            gsap.to(cards, {
                                skewX: 0,
                                duration: 0.5,
                                ease: "power3.out",
                                overwrite: "auto"
                            })
                        }, 100)
                    }
                }
            })
        }
    })
}, { scope: sectionRef })
```

### 2. Parallax Interno alle Card

Immagini che si muovono diversamente dal container:

```javascript
cards.forEach(card => {
    const img = card.querySelector('.parallax-img')
    
    gsap.fromTo(img,
        { scale: 1.2 },
        {
            scale: 1,
            ease: "none",
            scrollTrigger: {
                trigger: card,
                containerAnimation: tween, // ⚠️ Importante!
                start: "left right",
                end: "right left",
                scrub: true
            }
        }
    )
})
```

**Nota**: `containerAnimation: tween` sincronizza con lo scroll orizzontale

### 3. Progress Indicator

Mostra quanto dell'horizontal scroll è completato:

```javascript
<div className="fixed bottom-12 left-12 z-20">
    <div className="w-32 h-1 bg-white/20">
        <div 
            ref={progressRef}
            className="h-full bg-white transition-all"
            style={{ width: '0%' }}
        />
    </div>
</div>

// In useGSAP:
scrollTrigger: {
    // ...
    onUpdate: (self) => {
        const progress = self.progress * 100
        gsap.to(progressRef.current, {
            width: `${progress}%`,
            duration: 0.3
        })
    }
}
```

## Layout CSS Critico

```css
/* Track deve essere inline-flex per calcolare scrollWidth */
.horizontal-track {
    display: flex;
    flex-direction: row;
    width: fit-content; /* ⚠️ Importante per scrollWidth */
}

/* Cards devono avere width fissa */
.service-card {
    flex-shrink: 0; /* Non ridurre dimensione */
    width: 600px;
}

/* Gap tra cards */
.horizontal-track {
    gap: 3rem; /* 48px */
}
```

## Responsive Strategy

### Desktop (>768px)
- Horizontal scroll pinned
- Mouse wheel scroll orizzontale
- Velocity effects enabled

### Tablet (768px - 1024px)
- Ancora horizontal, ma card più piccole
- No velocity effects (performance)

### Mobile (<768px)
- Vertical stack
- No pin
- Simple fade-in animations

```javascript
ScrollTrigger.matchMedia({
    "(min-width: 1024px)": function () {
        // Full desktop experience
        // Velocity skew enabled
    },
    "(min-width: 768px) and (max-width: 1023px)": function () {
        // Tablet: horizontal but simpler
        // No velocity effects
    },
    "(max-width: 767px)": function () {
        // Mobile: vertical stack
        gsap.set(track, { x: 0 })
        
        cards.forEach(card => {
            gsap.fromTo(card,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%"
                    }
                }
            )
        })
    }
})
```

## Performance Tips

1. **Use `will-change-transform`** sul track:
```jsx
<div className="will-change-transform" ref={trackRef}>
```

2. **Limita il numero di cards**: Max 8-10 per section (performance)

3. **Lazy load images** nelle card:
```jsx
<Image 
    src={src} 
    loading="lazy" 
    placeholder="blur"
/>
```

4. **Disable su mobile se troppo pesante**:
```javascript
if (window.innerWidth < 768) {
    // Skip horizontal scroll setup
    return
}
```

## Casi Limite

### ScrollWidth non calcolata correttamente
**Sintomo**: Lo scroll finisce prima/dopo
**Soluzione**: 
- Verificare che track abbia `width: fit-content`
- Usare `invalidateOnRefresh: true`
- Cards devono avere `flex-shrink: 0`

### Scroll non smooth
**Sintomo**: Scroll a scatti
**Soluzione**: Aumentare `scrub` value (1 → 1.5 o 2)

### Conflitto con altri ScrollTrigger
**Sintomo**: Animazioni si interferiscono
**Soluzione**: Usare `id` univoci per i ScrollTrigger

### Mobile mostra layout rotto
**Sintomo**: Cards sovrapposte su mobile
**Soluzione**: Usare `flex-col` su mobile:
```jsx
className="flex flex-col md:flex-row"
```

## Testing Checklist

- [ ] Desktop: scroll orizzontale funziona?
- [ ] Desktop: pin funziona (section rimane fissa)?
- [ ] Desktop: velocity effects smooth?
- [ ] Mobile: vertical stack corretto?
- [ ] Mobile: no horizontal overflow?
- [ ] Resize: `invalidateOnRefresh` ricalcola correttamente?
- [ ] Performance: no lag durante scroll?

## Esempi nel Codebase

**Riferimento**: `frontend/components/ServicesSection.jsx`

Caratteristiche implementate:
- ✅ Horizontal scroll pinned (desktop)
- ✅ Vertical stack (mobile)
- ✅ Velocity-based skew
- ✅ Parallax interno
- ✅ Responsive con matchMedia

## Note
- La durata dello scroll è automatica (basata su scrollWidth)
- `scrub: 1` è un buon default (smooth ma responsive)
- Testare sempre con mouse wheel E trackpad (sensibilità diversa)
- Su Safari iOS, horizontal scroll può avere comportamenti diversi
