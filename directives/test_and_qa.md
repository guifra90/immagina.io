# Testing e Quality Assurance

## Obiettivo
Definire processi e standard per testare il frontend e garantire qualità del codice prima del deploy.

## Tipi di Testing

### 1. Unit Testing (Opzionale per ora)

**Setup con Jest + React Testing Library**:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

**Esempio test per componente**:

```javascript
// components/MagneticButton.test.js
import { render, screen } from '@testing-library/react'
import MagneticButton from './MagneticButton'

describe('MagneticButton', () => {
  it('renders children', () => {
    render(
      <MagneticButton>
        <button>Click me</button>
      </MagneticButton>
    )
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

### 2. Visual Testing (Manual)

**Checklist per ogni componente**:

- [ ] **Desktop** (1920x1080)
  - [ ] Rendering corretto
  - [ ] Animazioni smooth
  - [ ] Hover states funzionanti
  - [ ] No overflow orizzontale

- [ ] **Tablet** (768x1024)
  - [ ] Layout responsivo
  - [ ] Touch interactions
  - [ ] No scroll orizzontale

- [ ] **Mobile** (375x667)
  - [ ] Stack verticale
  - [ ] Font leggibili
  - [ ] Bottoni cliccabili (min 44px)
  - [ ] Animazioni disabilitate se necessario

### 3. Browser Testing

**Test su**:
- ✅ Chrome (latest)
- ✅ Safari (desktop + iOS)
- ✅ Firefox (latest)
- ⚠️ Safari iOS (critical - spesso diverso)
- ⚠️ Chrome Android

**Tool**: [BrowserStack](https://www.browserstack.com/) per testing cross-browser

### 4. Performance Testing

**Lighthouse Audit**:

```bash
npx lighthouse https://immagina.io --view
```

**Target Scores**:
- Performance: > 80
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

**Core Web Vitals**:
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

### 5. Accessibility Testing

**Automatic checks**:
```bash
npm install --save-dev @axe-core/react
```

**Manual checks**:
- [ ] Keyboard navigation (Tab through all links/buttons)
- [ ] Screen reader friendly (alt text, ARIA labels)
- [ ] Color contrast (min 4.5:1 for text)
- [ ] Focus indicators visibili
- [ ] No keyboard traps

**Tool**: [WAVE Browser Extension](https://wave.webaim.org/extension/)

### 6. SEO Testing

**Pre-Deploy Check**:
```bash
node execution/pre_deploy_check.js
```

**Manual**:
- [ ] Meta title presente (50-60 char)
- [ ] Meta description (150-160 char)
- [ ] Open Graph tags
- [ ] Alt text su immagini
- [ ] H1 unico per pagina
- [ ] Heading hierarchy corretta
- [ ] Sitemap.xml accessibile
- [ ] Robots.txt configurato

**Tool**: [Google Rich Results Test](https://search.google.com/test/rich-results)

## Workflow di Testing

### Pre-Commit

```bash
# Lint
npm run lint

# Type check (se usi TypeScript)
# npm run type-check
```

### Pre-Deploy

```bash
# Run all checks
node execution/pre_deploy_check.js

# Build test
npm run build

# Visual review
npm run dev
# → Apri localhost:3000
# → Test manuale di tutte le sezioni
```

### Post-Deploy

```bash
# Lighthouse on production
npx lighthouse https://immagina.io --view

# Asset audit
node execution/audit_assets.js

# Manual smoke test
# → Apri il sito production
# → Click su tutti i link
# → Test form contatti
# → Verifica animazioni
```

## Testing Checklist Completa

### Funzionalità

- [ ] Tutte le sezioni caricano
- [ ] Navigation funziona (smooth scroll)
- [ ] Mobile menu toggle funziona
- [ ] Form contatti invia dati
- [ ] Link esterni aprono nuova tab
- [ ] Immagini caricano correttamente
- [ ] Video/Canvas rendering (se presenti)

### Animazioni GSAP

- [ ] Hero reveal funziona
- [ ] Scroll-triggered animations attivano
- [ ] Parallax smooth
- [ ] Horizontal scroll su ServicesSection
- [ ] Nessun FOUC (flash of unstyled content)
- [ ] Velocity skew funziona
- [ ] Hover effects responsive

### Responsive

- [ ] Desktop (> 1024px): Layout pieno
- [ ] Tablet (768-1023px): Layout adattato
- [ ] Mobile (< 768px): Stack verticale
- [ ] No scroll orizzontale indesiderato
- [ ] Font size leggibili su mobile
- [ ] Touch targets >= 44px

### Performance

- [ ] Lighthouse score > 80
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Immagini ottimizzate
- [ ] No console errors
- [ ] No console warnings (in production)

### SEO

- [ ] Meta tags corretti
- [ ] OG image presente
- [ ] Sitemap accessibile (/sitemap.xml)
- [ ] Robots.txt accessibile (/robots.txt)
- [ ] Structured data valido
- [ ] Mobile-friendly (Google test)

### Accessibility

- [ ] Keyboard navigation funziona
- [ ] Focus indicators visibili
- [ ] Alt text su tutte le immagini
- [ ] Color contrast WCAG AA
- [ ] ARIA labels dove necessario
- [ ] No tab traps

## Automated Testing Scripts

### GitHub Actions CI (Future)

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: node ../execution/pre_deploy_check.js
```

## Bug Tracking

**Quando trovi un bug**:

1. **Reproduci**: Verifica che sia riproducibile
2. **Documenta**: Screenshot, console errors, steps to reproduce
3. **Priorità**:
   - 🔴 Critical: Sito rotto, non funziona
   - 🟠 High: Funzionalità importante rotta
   - 🟡 Medium: Bug visivo o UX issue
   - 🟢 Low: Nice-to-have

4. **Fix e Test**: Fixalo, testa, commit

## Tools Consigliati

### Development
- **Chrome DevTools**: Inspect, debug, performance
- **React DevTools**: Component tree
- **Redux DevTools**: State (se usi Redux)

### Testing
- **Lighthouse**: Performance audit
- **WAVE**: Accessibility check
- **Responsively**: Multi-device preview tool

### Monitoring
- **Vercel Analytics**: Traffic e performance
- **Google Search Console**: SEO monitoring
- **Sentry** (opzionale): Error tracking

## Casi Limite

### Animazioni Lag su Mobile

**Sintomo**: Scroll a scatti, animazioni lente

**Soluzione**:
- Disabilita animazioni pesanti su mobile
- Usa `ScrollTrigger.matchMedia()` per condizioni
- Riduci complessità animazioni

### Safari Issues

**Sintomo**: Funziona su Chrome ma non Safari

**Cause comuni**:
- Prefix CSS mancanti (Tailwind gestisce)
- GSAP plugin non registrati
- WebGL/Canvas issues

**Soluzione**: Test sempre su Safari reale (iOS + desktop)

### Lighthouse Score Basso

**Sintomo**: Performance < 80

**Soluzioni**:
- Ottimizza immagini (WebP, compressione)
- Lazy load below-fold content
- Code splitting
- Remove unused CSS

## Note

- **Test su Real Devices**: Emulatori non bastano, testa su iPhone/Android reali
- **Continuous Testing**: Non solo pre-deploy, testa durante sviluppo
- **User Feedback**: Beta testers sono preziosi

## Riferimenti

- [Web.dev Testing](https://web.dev/testing/)
- [React Testing Library](https://testing-library.com/react)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
