# Creazione Componenti Frontend

## Obiettivo
Standardizzare la creazione di componenti React per il frontend di Immagina.io, garantendo consistenza nel design, nelle animazioni e nella struttura del codice.

## Input
- **Nome Componente**: PascalCase (es. `HeroSection`, `ServiceCard`).
- **Funzionalità**: Descrizione di cosa deve fare il componente.
- **Dipendenze**: Librerie necessarie (es. `framer-motion`, `lucide-react`).

## Tool da Utilizzare
Non c'è uno script automatico, seguire questo processo manuale o usare l'AI per generare il codice secondo questo standard.

## Standard di Codice

### 1. Import
```javascript
'use client' // Se usa hook o interazioni

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image' // Se necessario
import { IconName } from 'lucide-react' // Se necessarie icone
```

### 2. Struttura Componente
Utilizzare componenti funzionali esportati come default.

```javascript
export default function NomeComponente({ props }) {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Contenuto */}
      </div>
    </section>
  )
}
```

### 3. Styling (Tailwind CSS)
- Usare colori semantici: `text-primary`, `bg-background`, `text-muted`.
- Spaziature consistenti: `py-10`, `py-20`, `gap-8`.
- Tipografia: `font-display` per titoli, `font-sans` per testo.

### 4. Animazioni (Framer Motion)
Ogni elemento significativo deve avere un'entrata animata.

```javascript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  {/* Content */}
</motion.div>
```

## Output
File `.jsx` in `frontend/components/` che esporta il componente.

## Checklist Qualità
- [ ] Il file usa `'use client'` se necessario?
- [ ] Le animazioni sono fluide e non invasive?
- [ ] È responsive (mobile-first o desktop-first con override)?
- [ ] Usa le variabili di colore globali (`primary`, `background`)?

## Casi Limite
- **Contenuto dinamico**: Se il componente riceve dati, definire `PropTypes` o default props sicuri.
- **Immagini mancanti**: Usare placeholder o fallback se `src` non è garantito.
