# Vercel Deployment Tools

Questi strumenti automatizzano e semplificano il processo di deployment del frontend su Vercel.

## 📋 Direttiva

**File**: [`directives/deploy_to_vercel.md`](file:///Users/francescoguidotti/Documents/Lavoro/immagina.io/directives/deploy_to_vercel.md)

Contiene:
- ✅ Processo step-by-step completo
- ✅ Configurazione file corretta
- ✅ Errori comuni e soluzioni
- ✅ Checklist pre/post deploy
- ✅ Rollback procedures

**Quando usarlo**: Prima di ogni deploy, leggi la direttiva per assicurarti di seguire il processo corretto.

---

## 🔧 Script di Verifica Automatica

**File**: [`execution/vercel_deploy_check.js`](file:///Users/francescoguidotti/Documents/Lavoro/immagina.io/execution/vercel_deploy_check.js)

### Cosa fa

Esegue automaticamente 8 controlli critici:

1. ✅ **Next.js Config** - Verifica che `next.config.js` non abbia `output: 'export'`
2. ✅ **NPM Config** - Verifica che `.npmrc` contenga `legacy-peer-deps=true`
3. ✅ **Vercel Config** - Verifica che `vercel.json` non abbia `outputDirectory`
4. ✅ **SEO Files** - Controlla presenza di `robots.txt` e `sitemap.xml`
5. ✅ **Three.js Components** - Verifica che HeroCanvas sia disabilitato
6. ✅ **Dependencies** - Mostra versioni critiche
7. ✅ **Console Logs** - Trova tutti i console.log nel codice
8. ✅ **Build Test** - Esegue build locale e misura tempo

### Uso

```bash
# Dalla root del progetto
node execution/vercel_deploy_check.js
```

### Output

Lo script termina con uno di questi stati:

**✅ Tutto OK**:
```
🎉 TUTTO OK! Nessun errore o warning trovato
✨ Pronto per il deploy! Esegui: npx vercel --prod
Exit code: 0
```

**⚠️ Warning ma OK per deploy**:
```
⚠️ Ci sono alcuni warning, ma puoi procedere con il deploy
ℹ️ Considera di risolvere i warning per un deploy ottimale
✨ Pronto per il deploy! Esegui: npx vercel --prod
Exit code: 0
```

**❌ Errori - NON deployare**:
```
❌ CI SONO ERRORI CHE DEVONO ESSERE RISOLTI PRIMA DEL DEPLOY!
ℹ️ Correggi gli errori sopra e ri-esegui questo script
Exit code: 1
```

---

## 🚀 Workflow Completo

### 1. Pre-Deploy Check
```bash
node execution/vercel_deploy_check.js
```

### 2. Se ci sono errori, correggili
Lo script ti dirà esattamente cosa sistemare.

### 3. Deploy
```bash
cd frontend
npx vercel --prod
```

### 4. Verifica
Apri https://immagina-io.vercel.app e controlla:
- Homepage carica senza errori
- Console browser pulita
- Tutte le sezioni visibili
- Navigazione funzionante

---

## 📝 Note Importanti

### Build Time
- **Locale**: 30-60 secondi ✅
- **Vercel**: 30-60 secondi ✅
- **< 10 secondi**: ❌ PROBLEMA! Build non eseguito

### Configurazione Files

#### next.config.js ✅
```javascript
const nextConfig = {
    reactStrictMode: true,
    images: { domains: [] }
}
```

#### next.config.js ❌
```javascript
const nextConfig = {
    output: 'export',           // ❌ RIMUOVI
    trailingSlash: true,        // ❌ RIMUOVI
    images: { 
        unoptimized: true       // ❌ RIMUOVI
    }
}
```

### Errori Comuni Rilevati

1. **404 su tutti i route** → Output Directory configurata male
2. **Build troppo veloce** → Cache corrotta, elimina progetto
3. **Client-side exception** → Three.js non disabilitato
4. **Peer dependency errors** → .npmrc mancante
5. **Routes manifest not found** → `output: 'export'` presente

---

## 🔄 Aggiornamenti Script

Se aggiungi nuove funzionalità o trovi nuovi problemi durante il deploy:

1. Aggiorna `directives/deploy_to_vercel.md` con la nuova procedura
2. Aggiungi un nuovo check in `execution/vercel_deploy_check.js` se applicabile
3. Testa lo script: `node execution/vercel_deploy_check.js`

---

## 📊 Checklist Rapida

Prima di ogni deploy:

- [ ] `node execution/vercel_deploy_check.js` → exit 0
- [ ] Build locale completato in 30-60s
- [ ] Zero console errors in dev mode
- [ ] Deployment completato su Vercel
- [ ] Homepage carica su production URL
- [ ] Console browser pulita (zero errori)
- [ ] Navigazione testata e funzionante

---

## 🆘 Supporto

**Se lo script fallisce**:
1. Leggi attentamente l'output - ti dirà cosa sistemare
2. Correggi gli errori indicati
3. Ri-esegui lo script
4. Se ancora problemi, consulta `directives/deploy_to_vercel.md`

**Se il deploy fallisce su Vercel**:
1. Guarda build logs su dashboard Vercel
2. Cerca il tempo di build - se < 10s c'è un problema
3. Consulta sezione "Errori Comuni" in `directives/deploy_to_vercel.md`

---

## ⏱️ Timeline Atteso

- Pre-deploy check: **1-2 min**
- Correzione errori (se presenti): **2-5 min**
- Deploy Vercel: **1-2 min**
- Verifica post-deploy: **2-3 min**

**Totale**: ~5-8 minuti per un deploy completo e verificato

---

*Ultimo aggiornamento: 2026-01-30*
