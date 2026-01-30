# Deploy su Vercel

## Obiettivo
Guidare il processo di deploy del frontend Next.js su Vercel, dalla configurazione iniziale al continuous deployment.

## Input
- **Repository Git**: URL del repository (GitHub, GitLab, Bitbucket)
- **Branch**: Branch da deployare (default: `main`)
- **Environment Variables**: Variabili d'ambiente necessarie (API keys, ecc.)

## Prerequisiti

1. **Account Vercel**: Crea account su [vercel.com](https://vercel.com)
2. **Git Repository**: Codice deve essere in un repository Git
3. **Build Success**: `npm run build` deve passare localmente

## Processo di Deploy

### 1. Preparazione Pre-Deploy

**Verifica che tutto funzioni**:
```bash
# Dalla cartella frontend
npm run build
npm run lint
```

**Esegui pre-deploy check** (se disponibile):
```bash
node ../execution/pre_deploy_check.js
```

**Commit e push**:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Configurazione Vercel

**Opzione A: Vercel CLI (Consigliato)**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy dalla cartella frontend
cd frontend
vercel

# Segui il wizard:
# - Link a Git repository? Yes
# - Link to existing project? No (prima volta)
# - Project name: immagina-io
# - Directory: ./ (o frontend se sei nella root)
# - Override settings? No
```

**Opzione B: Vercel Dashboard**

1. Vai su [vercel.com/new](https://vercel.com/new)
2. Import Git Repository
3. Seleziona il repository
4. Configure Project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend` (se il progetto è in una subdirectory)
   - **Build Command**: `npm run build` (auto-detect)
   - **Output Directory**: `.next` (auto-detect)
5. Click "Deploy"

### 3. Configurazione Environment Variables

**Su Vercel Dashboard**:
1. Settings → Environment Variables
2. Aggiungi variabili necessarie:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

**Usando CLI**:
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Inserisci il valore quando richiesto
```

**⚠️ Important**: 
- Variabili `NEXT_PUBLIC_*` sono esposte al client
- Variabili senza prefisso sono server-side only

### 4. Domain Setup (Opzionale)

**Custom Domain**:
1. Vercel Dashboard → Settings → Domains
2. Add Domain → `immagina.io`
3. Configura DNS:
   - Type: `A` Record
   - Name: `@`
   - Value: `76.76.21.21` (Vercel IP)
   
   oppure
   
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`

4. Attendi propagazione DNS (5-60 minuti)

### 5. Verifica Deploy

**Check Build Logs**:
- Vercel Dashboard → Deployments → Latest
- Verifica che il build sia verde ✅

**Test del Sito**:
- Apri l'URL fornito da Vercel (es: `immagina-io.vercel.app`)
- Testa tutte le sezioni
- Verifica animazioni
- Check su mobile

**Performance Check**:
```bash
# Lighthouse audit
npx lighthouse https://immagina-io.vercel.app --view
```

## Continuous Deployment

Una volta configurato, Vercel auto-deploya ad ogni push:

```bash
git add .
git commit -m "Update hero section"
git push origin main
# → Vercel deploya automaticamente
```

**Preview Deployments**:
- Ogni branch/PR ottiene un URL di preview
- Esempio: `immagina-io-git-feature-xyz.vercel.app`

## Configurazione Avanzata

### vercel.json

Crea `frontend/vercel.json` per configurazioni custom:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page",
      "permanent": true
    }
  ]
}
```

### Analytics

**Vercel Analytics** (gratis per Hobby):
1. Dashboard → Analytics → Enable
2. Aggiungi al layout:

```javascript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Speed Insights

```bash
npm i @vercel/speed-insights
```

```javascript
import { SpeedInsights } from '@vercel/speed-insights/next';

<SpeedInsights />
```

## Rollback

Se un deploy rompe qualcosa:

1. Vercel Dashboard → Deployments
2. Trova il deployment precedente funzionante
3. Click "Promote to Production"

Oppure via CLI:
```bash
vercel rollback
```

## Casi Limite

### Build Fallisce su Vercel ma Passa Localmente

**Sintomo**: `Error: Command "npm run build" exited with 1`

**Cause comuni**:
1. **Node version mismatch**
   - Soluzione: Specifica in `package.json`:
   ```json
   "engines": {
     "node": "18.x"
   }
   ```

2. **Missing dependencies**
   - Soluzione: Verifica `package.json` dependencies

3. **Environment variables mancanti**
   - Soluzione: Aggiungi su Vercel Dashboard

### Immagini Non Si Caricano

**Sintomo**: Broken image icons

**Soluzione**: 
- Verifica path (devono essere `/images/...` non `./images/...`)
- Check che le immagini siano in `public/`
- Enable Image Optimization in vercel.json se necessario

### Animazioni GSAP Non Funzionano

**Sintomo**: Elementi statici, no animazioni

**Soluzione**:
- Verifica che GSAP sia in `dependencies` (non `devDependencies`)
- Check console errors per plugin mancanti

### 404 su Route Dinamiche

**Sintomo**: Pagine dinamiche ritornano 404

**Soluzione**: Verifica `generateStaticParams()` per SSG

## Checklist Deploy

Pre-Deploy:
- [ ] `npm run build` passa localmente
- [ ] `npm run lint` passa
- [ ] Tutte le immagini esistono
- [ ] SEO metadata configurato
- [ ] Commit e push su Git

Durante Deploy:
- [ ] Repository connesso a Vercel
- [ ] Environment variables configurate
- [ ] Build completa con successo
- [ ] Preview URL funziona

Post-Deploy:
- [ ] Production URL accessibile
- [ ] Tutte le sezioni caricate
- [ ] Animazioni funzionanti
- [ ] Mobile responsive
- [ ] Performance accettabile (Lighthouse > 80)

## Monitoraggio Post-Deploy

**Metrics da monitorare**:
1. **Core Web Vitals** (Vercel Speed Insights)
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1

2. **Build Times** (Vercel Dashboard)
   - Target: < 2 minuti

3. **Error Rates** (Vercel Logs)
   - Nessun errore 500

## Note

- **Free Tier Limits** (Hobby):
  - 100 GB bandwidth/month
  - 100 build hours/month
  - Generalmente sufficiente per portfolio

- **Vercel Edge Network**:
  - CDN globale automatico
  - Nessuna config necessaria

- **Automatic HTTPS**:
  - SSL gratuito e automatico
  - Nessuna configurazione necessaria

## Tips

1. **Use Preview Deployments**: Testa su branch prima di merge
2. **Enable Protection**: Password protect preview deployments
3. **Monitor Analytics**: Usa Vercel Analytics per capire traffico
4. **Optimize Images**: Next.js Image Optimization è automatico

## Riferimenti

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel CLI](https://vercel.com/docs/cli)
