# Generazione Asset con AI

## Obiettivo
Standardizzare il processo di generazione di immagini e asset grafici usando AI, garantendo coerenza stilistica con il brand Immagina.io.

## Input
- **Tipo Asset**: (hero-image, project-mockup, service-icon, background-texture, ui-element)
- **Contesto**: Dove sarà usato l'asset (Hero, Services, Work, ecc.)
- **Style Requirements**: Specifiche estetiche (cyberpunk, minimalist, abstract, ecc.)
- **Dimensioni Suggerite**: Aspect ratio o dimensioni target

## Tool da Utilizzare
- **AI Image Generation**: `generate_image` tool (Antigravity built-in)
- **Storage**: Salvare in `frontend/public/images/`
- **Naming Convention**: `{section}-{type}-{identifier}.png`

## Palette Colori Brand

Riferirsi sempre a `brand-guidelines.md`:

- **Primary Red**: `#E63946`
- **Dark Background**: `#111111`
- **Deep Gradient**: `#0f172a` → `#2d0b33` → `#4a0404`
- **Text Colors**: `#FFFFFF`, `#A8A8A8`

## Prompt Template per Tipologia

### 1. Hero Images
**Stile**: Futuristico, VR, Cyberpunk elegante

```
Prompt Template:
"[Subject] in futuristic setting. Dark premium tech aesthetic. 
Glowing [primary color] and violet accents. Deep black background. 
Cinematic lighting. Cyberpunk vibes but elegant. High resolution 8k. 
No text overlays."

Esempio:
"Person wearing VR headset in futuristic setting. Dark premium tech aesthetic. 
Glowing red and violet accents. Deep black background. 
Cinematic lighting. Cyberpunk vibes but elegant. High resolution 8k. No text."
```

### 2. Service Section Images
**Stile**: Abstract, Tech, Minimal

```
Prompt Template:
"Abstract visualization of '[Service Name]'. 
[Color scheme: blues/purples/reds]. 
[Style: geometric/organic/network]. 
Dark background. Premium tech aesthetic. 
High-end 3D render. No text."

Esempi:
- AI Native: "Glowing red and violet nodes connecting in complex network. 
  Dark black background. Cyberpunk elegant. Architectural composition. No text."
  
- Strategic Design: "Minimalist geometric shapes. Golden ratio lines. 
  White and dark grey palette with metallic silver. 
  Deep shadows, spotlight effect. Award-winning style. No text."
  
- AI Agents: "Digital ethereal brain made of particles. 
  Deep blue and purple gradients. Futuristic, data-driven. 
  High-end 3D render. No text."
  
- Motion: "Liquid metal flowing. Kinetic energy, motion blur. 
  Vibrant red and orange gradients on black. Dynamic, fluid. 3D render. No text."
```

### 3. Project Mockups (Work Section)
**Stile**: Photorealistic UI/UX, Contextual

```
Prompt Template:
"[Project type] interface displaying on [device/context]. 
[Specific visual elements]. 
[Lighting: cinematic/natural/neon]. 
[Color palette]. 
High resolution, photorealistic. No placeholder text."

Esempi:
- Dashboard: "Futuristic data visualization dashboard. Dark UI with glowing 
  cyan nodes. Complex network analysis. Sleek glass screen. 
  Cinematic lighting. Photorealistic 8k."
  
- E-commerce: "Cyberpunk streetwear brand storefront. Neon kanji signs. 
  Pink and purple lights on wet pavement. Glitch art aesthetic. 
  Bold and edgy. High resolution."
  
- Fashion AR: "Model wearing AR headset. Ethereal lighting. 
  Emerald and teal accents. Clean minimalist luxury aesthetic. 
  Elegant serif typography overlay. 8k render."
```

### 4. Background Textures
**Stile**: Subtle, Non-invasivo

```
Prompt Template:
"Abstract [texture type]. Very dark [color] background. 
Subtle [effect]. Minimal, elegant. 
Seamless tileable pattern. Ultra high resolution."

Esempio:
"Abstract grain texture. Very dark grey background. 
Subtle noise, barely visible. Minimal, elegant. 
Seamless pattern. 4k resolution."
```

## Processo di Generazione

1. **Definire il Contesto**: Quale sezione? Quale messaggio?
2. **Scegliere Template**: Usa i template sopra come base
3. **Personalizzare Prompt**: Aggiungi dettagli specifici
4. **Generare**: Usa `generate_image` tool
5. **Verificare Coerenza**: Controlla che rispetti il brand
6. **Salvare con Nome Corretto**: `{section}-{type}-{id}.png`
7. **Copiare in Public**: Muovi da artifacts a `frontend/public/images/`

## Naming Convention

```
hero-vr-glass.png
hero-girl-cyberpunk.png
service-ai-native.png
service-strategic-design.png
work-project-1.png
work-neural-dashboard.png
branding-image.png
background-gradient-overlay.png
```

**Pattern**: `{section}-{descriptor}-{optional-number}.{ext}`

## Comandi Standard

```bash
# Generare asset (tramite AI assistant)
generate_image(prompt="...", name="service_ai_native")

# Copiare in public
cp /path/to/artifact/service_ai_native_*.png \
   frontend/public/images/service-ai-native.png
```

## Checklist Qualità

- [ ] L'immagine rispetta la palette colori del brand?
- [ ] Lo stile è coerente con le altre immagini della sezione?
- [ ] Non ci sono watermark o testo non voluto?
- [ ] La risoluzione è adeguata (min 1920x1080 per hero)?
- [ ] Il file è ottimizzato per il web (< 500KB ideale)?

## Casi Limite

### Immagine non coerente con brand
**Sintomo**: Colori troppo vivaci o stile cartoon
**Soluzione**: Aggiungere al prompt "dark premium tech aesthetic" e specificare palette

### Testo indesiderato nell'immagine
**Sintomo**: L'AI genera testo casuale
**Soluzione**: Aggiungere "No text" o "No typography" al prompt

### Soggetto tagliato o mal composto
**Sintomo**: Elementi fuori frame
**Soluzione**: Specificare "full frame" o "centered composition" nel prompt

## Ottimizzazione Post-Generazione

Se l'immagine è > 500KB, considerare:

```bash
# Usando script di ottimizzazione (se disponibile)
node frontend/optimize-images.js frontend/public/images/service-ai-native.png
```

Oppure usare servizi online come TinyPNG o Squoosh.

## Note
- Le immagini Hero dovrebbero essere ≥ 1920x1080
- Le immagini Services possono essere 1200x800
- Le Projects idealmente 1600x1200
- Formato preferito: PNG per trasparenze, JPG per foto
- Usare sempre WebP quando possibile (Next.js lo fa automaticamente)

## Esempi di Asset Generati

Vedi `walkthrough.md` per galleria degli asset creati per:
- Services Section (4 immagini abstract tech)
- Work Section (3 project mockups)
- Hero Section (VR glass visual)
