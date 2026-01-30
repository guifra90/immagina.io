# README - Directives

Questa cartella contiene le **direttive operative** (SOP - Standard Operating Procedures) per lo sviluppo del progetto Immagina.io.

## Cos'è una Direttiva?

Una direttiva è un documento Markdown che definisce:
- **Obiettivo**: Cosa si vuole ottenere
- **Input**: Parametri necessari
- **Tool/Script**: Strumenti da utilizzare
- **Output**: Risultato atteso
- **Processo**: Step-by-step
- **Casi Limite**: Errori comuni e soluzioni

## Architettura a 3 Livelli

Il progetto segue una separazione netta tra intelligenza e esecuzione:

1. **Livello 1 - Direttive** (`directives/`): SOP in Markdown
2. **Livello 2 - Orchestrazione**: AI Agent decision-making
3. **Livello 3 - Esecuzione** (`execution/`): Script JavaScript deterministici

## Direttive Disponibili

### Frontend Development

#### [`create_frontend_component.md`](./create_frontend_component.md)
Creazione di componenti React standardizzati per Next.js.

**Quando usare**: Nuovo componente UI (section, card, layout)

**Output**: File `.jsx` in `frontend/components/`

---

#### [`create_gsap_animation.md`](./create_gsap_animation.md)
Pattern di animazione GSAP (scroll-trigger, reveal, parallax, velocity).

**Quando usare**: Implementare animazioni premium

**Output**: Hook `useGSAP` con animazioni configurate

**Pattern inclusi**:
- Fade in + slide up
- Clip-path mask reveal
- Scroll-triggered animations
- Velocity-based skew
- Parallax effects
- Horizontal scroll sections

---

#### [`create_interactive_component.md`](./create_interactive_component.md)
Componenti interattivi (Magnetic Button, Custom Cursor, Hover Effects).

**Quando usare**: Aggiungere micro-interazioni premium

**Output**: Componente React interattivo

**Esempi**:
- `MagneticButton.jsx`
- `CustomCursor.jsx`
- Hover scale effects

---

#### [`create_horizontal_scroll_section.md`](./create_horizontal_scroll_section.md)
Sezioni con scroll orizzontale pinned (GSAP ScrollTrigger).

**Quando usare**: Portfolio, gallery, showcase orizzontale

**Output**: Section React con horizontal scroll

**Riferimento**: `ServicesSection.jsx`

---

### Asset & Design

#### [`generate_brand_assets.md`](./generate_brand_assets.md)
Generazione immagini e asset grafici con AI.

**Quando usare**: Servono immagini hero, mockups, icone, backgrounds

**Output**: File PNG/JPG in `frontend/public/images/`

**Palette Colori**: 
- Primary Red: `#E63946`
- Dark Background: `#111111`
- Gradient: `#0f172a` → `#2d0b33` → `#4a0404`

**Template inclusi**:
- Hero images (VR, cyberpunk)
- Service abstract visuals
- Project mockups
- Background textures

---

### Deployment & Production

#### [`deploy_to_vercel.md`](./deploy_to_vercel.md)
Processo completo di deploy su Vercel.

**Quando usare**: Prima deploy o aggiornamento configurazione

**Copre**:
- Setup account e repository
- Environment variables
- Custom domain configuration
- Continuous deployment
- Rollback procedures

---

#### [`optimize_seo.md`](./optimize_seo.md)
Ottimizzazione SEO completa del sito.

**Quando usare**: Setup iniziale SEO o audit

**Include**:
- Meta tags (OpenGraph, Twitter Card)
- Structured Data (JSON-LD)
- Sitemap e robots.txt
- Image optimization
- Performance tips
- Google Search Console setup

---

#### [`test_and_qa.md`](./test_and_qa.md)
Testing e Quality Assurance workflows.

**Quando usare**: Pre-deploy, debugging, audit qualità

**Copre**:
- Visual testing (desktop/tablet/mobile)
- Browser compatibility
- Performance testing (Lighthouse)
- Accessibility checks
- SEO validation

---

### Template

#### [`example_directive.md`](./example_directive.md)
Template base per creare nuove direttive.

---

## Come Usare le Direttive

### 1. Identifica l'Obiettivo
Cosa vuoi implementare? Cerca la direttiva corrispondente.

### 2. Leggi la Direttiva
Apri il file `.md` e leggi:
- Obiettivo
- Input necessari
- Pattern di implementazione

### 3. Segui il Processo
Esegui gli step documentati o chiedi all'AI di farlo seguendo la direttiva.

### 4. Verifica Output
Controlla che il risultato corrisponda all'output atteso.

### 5. Gestisci Casi Limite
Se incontri errori, consulta la sezione "Casi Limite" della direttiva.

## Workflow con AI Agent

Quando chiedi all'AI di implementare qualcosa, menziona la direttiva:

```
"Crea un nuovo componente seguendo create_frontend_component.md"
```

oppure

```
"Genera un'immagine hero seguendo generate_brand_assets.md,
stile cyberpunk con VR headset"
```

L'AI leggerà la direttiva e seguirà gli standard definiti.

## Script di Esecuzione Collegati

Alcune direttive hanno script corrispondenti in `execution/`:

| Direttiva | Script | Uso |
|-----------|--------|-----|
| `create_frontend_component.md` | `generate_component.js` | Auto-genera boilerplate |
| `optimize_seo.md` | `generate_seo_files.js` | Crea sitemap, robots.txt, ecc. |
| `test_and_qa.md` | `pre_deploy_check.js` | Automated testing |
| `test_and_qa.md` | `audit_assets.js` | Verifica asset |
| `test_and_qa.md` | `performance_monitor.js` | Lighthouse audit |

## Quick Reference

### Sviluppo Componenti
```bash
# Genera nuovo componente
node execution/generate_component.js MySection section

# Segui pattern in:
# - create_gsap_animation.md (per animazioni)
# - create_interactive_component.md (per interazioni)
```

### Pre-Deploy
```bash
# Run tutti i check
node execution/pre_deploy_check.js

# Audit assets
node execution/audit_assets.js

# Performance check
node execution/performance_monitor.js http://localhost:3000
```

### SEO Setup
```bash
# Genera file SEO
node execution/generate_seo_files.js

# Segui optimize_seo.md per metadata
```

### Deploy
```bash
# Segui deploy_to_vercel.md
vercel
```

## Contribuire

### Creare una Nuova Direttiva

1. Copia `example_directive.md`
2. Rinomina con verbo: `create_X.md`, `generate_Y.md`, `setup_Z.md`
3. Compila tutte le sezioni
4. Testa il processo
5. Documenta "Lezioni Apprese"

### Aggiornare una Direttiva Esistente

Quando scopri:
- Un caso limite nuovo
- Un pattern migliore
- Un bug fix

Aggiungi alla sezione appropriata con data:

```markdown
## Lezioni Apprese
- **2026-01-30**: Scoperto che X causa Y, soluzione: Z
```

## Best Practices

### ✅ DO
- Scrivi direttive specifiche e actionable
- Includi esempi di codice
- Documenta errori comuni
- Aggiorna con nuove scoperte
- Riferisci file esistenti come esempi

### ❌ DON'T
- Direttive troppo generiche
- Mancanza di esempi concreti
- Omettere casi limite
- Lasciare direttive obsolete

## Code Quality Standards

Tutte le direttive frontend seguono:

1. **Next.js 14** App Router
2. **React 18** con Hooks
3. **GSAP 3** per animazioni
4. **Tailwind CSS** per styling
5. **No TypeScript** (JavaScript only)

## Riferimenti Esterni

- [Brand Guidelines](../brand-guidelines.md): Colori, font, tone of voice
- [GEMINI.md](../GEMINI.md): Architettura a 3 livelli
- [Frontend README](../frontend/README.md): Setup e deploy
- [Execution README](../execution/README.md): Script automation

---

**Ultimo aggiornamento**: 2026-01-30  
**Direttive totali**: 8  
**Script collegati**: 5  
**Maintainer**: AI Agent + Team Immagina.io
