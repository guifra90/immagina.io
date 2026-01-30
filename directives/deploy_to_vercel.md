# Deploy Frontend a Vercel

## Obiettivo
Effettuare il deploy del frontend Next.js su Vercel in modo affidabile, evitando errori comuni e garantendo che il sito sia funzionante in produzione.

## Input
- Frontend Next.js funzionante in locale (`npm run dev` senza errori)
- Repository Git aggiornato (optional, ma consigliato)
- Account Vercel configurato

## Output
- Sito live su `https://immagina-io.vercel.app`
- Zero errori console in produzione
- Tutte le pagine funzionanti
- Build logs puliti

## Tool da Usare
- Script: `node ../execution/vercel_deploy_check.js` - Verifica pre-deploy automatica
- Script: `node ../execution/pre_deploy_check.js` - Check generali (lint, build, SEO)
- Comando: `npx vercel --prod` - Deploy a Vercel

## Processo Step-by-Step

### 1. Pre-Deploy Checks
Esegui lo script di verifica automatica:

```bash
cd frontend
node ../execution/vercel_deploy_check.js
```

Lo script verificherà:
- ✅ Configurazione `next.config.js` corretta (NO `output: 'export'`)
- ✅ `.npmrc` presente per peer dependencies
- ✅ `vercel.json` configurato correttamente
- ✅ Build locale funzionante
- ✅ Zero console.log nel codice
- ✅ Componenti Three.js disabilitati o con error boundary

Se ci sono errori, lo script ti dirà esattamente cosa sistemare.

### 2. Build Test Locale
Prima di deployare, SEMPRE testare il build in locale:

```bash
npm run build
```

**Tempo atteso**: 30-60 secondi (NON 322ms!)

**Verifica output**:
- Tutte le route devono essere generate correttamente
- Nessun errore di compilazione
- File `.next/` creato (NON `out/`)

### 3. Test Build Locale
Servi il build locale per testare:

```bash
npx serve@latest .next/standalone -l 3000
# OPPURE
npm run start
```

**Verifica**:
- Homepage carica senza errori
- Apri console browser: zero errori
- Clicca su un progetto: funziona
- Naviga indietro: funziona

### 4. Deploy a Vercel

#### Primo Deploy (Nuovo Progetto)
```bash
npx vercel --prod
```

**Rispondi**:
- Set up and deploy? **Y**
- Scope: `guifra90's projects`
- Link to existing? **N** (se nuovo)
- Project name: `immagina-io`
- Directory: `./` (conferma)
- Modify settings? **N**

#### Deploy Successivi
```bash
npx vercel --prod
```

Deploy automatico, nessuna domanda.

#### Deploy con Cache Pulita (se problemi)
```bash
npx vercel --prod --force
```

### 5. Monitoraggio Build
Mentre il build è in corso:

**Tempo atteso**: 30-60 secondi

**Watch for**:
- `Running "vercel build"` - OK
- `Build Completed in /vercel/output [XYZms]` - Se < 10s, PROBLEMA!
- `Deploying outputs...` - OK
- `Deployment completed` - OK

Se vedi `Build Completed in [...] [322ms]` → **PROBLEMA**: build non eseguito veramente!

**Soluzione**:
1. Vai su dashboard Vercel
2. Settings → Build & Development Settings
3. Verifica "Output Directory" sia **VUOTO**
4. Redeploy

### 6. Verifica Post-Deploy

#### Immediate Check
Apri https://immagina-io.vercel.app e verifica:
- [ ] Homepage carica (non 404)
- [ ] Nessun "Application error: a client-side exception has occurred"
- [ ] Console browser: zero errori
- [ ] Hero section visibile
- [ ] Scroll down: tutte le sezioni visibili

#### Deep Check
- [ ] `/work` → Griglia progetti visibile
- [ ] Click su progetto → Dettaglio carica
- [ ] Logo → Ritorna home
- [ ] Hamburger menu → Si apre
- [ ] Scroll smooth funziona

#### Performance Check (opzionale)
```bash
npx lighthouse https://immagina-io.vercel.app --view
```

Target scores:
- Performance: > 85
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 95

## Errori Comuni e Soluzioni

### Errore 1: 404 su Tutti i Route
**Sintomo**: Anche homepage mostra 404 Vercel

**Causa**: Output Directory configurata male

**Soluzione**:
1. Dashboard Vercel → Project Settings
2. Build & Development Settings
3. Output Directory: **LASCIA VUOTO** (cancella se presente)
4. Save
5. Redeploy: `npx vercel --prod --force`

### Errore 2: Build Troppo Veloce (< 10s)
**Sintomo**: `Build Completed in /vercel/output [322ms]`

**Causa**: Vercel usa cache corrotta o configurazione sbagliata

**Soluzione**:
1. Elimina progetto Vercel completamente
2. `rm -rf .vercel` (locale)
3. Ricrea: `npx vercel --prod` (nuovo setup)

### Errore 3: Client-Side Exception (Three.js)
**Sintomo**: "Application error: a client-side exception has occurred"

**Causa**: Conflitto peer dependencies con `@react-three/fiber`

**Soluzione**:
- Verifica `HeroCanvas.jsx` ritorna `null`
- Se necessario, commenta il componente
- Redeploy

### Errore 4: Peer Dependency Conflicts
**Sintomo**: `npm install` fallisce con errori ERESOLVE

**Soluzione**:
- Verifica `.npmrc` contenga `legacy-peer-deps=true`
- `npm install --legacy-peer-deps`
- Verifica `package.json` versioni:
  - `@react-three/fiber`: `^9.0.0`
  - React: `^18.3.0`

### Errore 5: Routes Manifest Not Found
**Sintomo**: `Error: The file "/vercel/path0/out/routes-manifest.json" couldn't be found`

**Causa**: `output: 'export'` in `next.config.js`

**Soluzione**:
- Rimuovi `output: 'export'` da `next.config.js`
- Rimuovi `trailingSlash: true`
- Rimuovi `images.unoptimized: true`
- Usa configurazione standard Next.js

## Configurazione File Corretta

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: [],
    },
}
module.exports = nextConfig
```

**NO**:
- ❌ `output: 'export'`
- ❌ `trailingSlash: true`
- ❌ `images.unoptimized: true`

### vercel.json
```json
{
    "framework": "nextjs",
    "regions": ["iad1"],
    "headers": [...]
}
```

**NO**:
- ❌ `buildCommand`
- ❌ `outputDirectory`

### .npmrc
```
legacy-peer-deps=true
```

**IMPORTANTE**: Questo file DEVE esistere!

## Rollback in Caso di Problemi

### Via Dashboard
1. Vercel Dashboard → Deployments
2. Trova deployment precedente funzionante
3. Click "..." → Promote to Production

### Via CLI
```bash
vercel rollback
```

## Continuous Deployment

Una volta configurato, ogni `git push`:
- ✅ Triggerà auto-deploy su Vercel
- ✅ Branch/PR ottengono preview URL
- ✅ Main branch → Production

## Note Importanti

1. **Mai deployare senza build test locale** - Se `npm run build` fallisce localmente, fallirà anche su Vercel
2. **Deployment Protection disabilitato** - Per accesso pubblico. Riabilita per staging.
3. **Node version** - Vercel usa Node 18.17.0+, assicurati di essere compatibile
4. **Three.js** - Se abiliti HeroCanvas, usa error boundary o lazy load
5. **Watch build logs** - Build < 10s = problema garantito

## Checklist Finale

Prima di considerare il deploy completo:

- [ ] Build locale eseguito con successo
- [ ] Nessun console.log nel codice
- [ ] Homepage carica senza errori
- [ ] Tutte le route testate
- [ ] Console browser pulita (zero errori)
- [ ] Navigazione funzionante
- [ ] Mobile responsivo verificato
- [ ] Build time su Vercel > 30s
- [ ] URL produzione funzionante
- [ ] SEO files presenti (robots.txt, sitemap.xml)

## Links Utili

- Dashboard: https://vercel.com/guifra90s-projects/immagina-io
- Production: https://immagina-io.vercel.app
- Deployments: https://vercel.com/guifra90s-projects/immagina-io/deployments
- Docs Vercel Next.js: https://vercel.com/docs/frameworks/nextjs

## Timeline Atteso

- Pre-deploy checks: 1-2 min
- Build locale: 1 min
- Deploy Vercel: 1-2 min
- Verifica post-deploy: 2-3 min

**Totale**: ~5-8 minuti per deploy completo e verificato
