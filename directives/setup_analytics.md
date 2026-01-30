# Setup Analytics

## Obiettivo
Configurare e integrare sistemi di analytics per monitorare traffico, comportamento utenti e performance del sito.

## Input
- **Platform**: Google Analytics, Vercel Analytics, o entrambi
- **Tracking ID**: GA measurement ID (se Google Analytics)
- **Goals/Events**: Eventi personalizzati da tracciare

## Analytics Platforms

### 1. Vercel Analytics (Consigliato per Start)

**Vantaggi**:
- Zero configurazione
- Privacy-friendly (no cookies)
- Integrazione nativa Next.js
- Gratis su Hobby plan
- Web Vitals automatici

**Setup**:

1. **Enable su Vercel Dashboard**:
   - Dashboard → Project → Analytics → Enable

2. **Install package**:
```bash
cd frontend
npm install @vercel/analytics
```

3. **Aggiungi al layout**:

```javascript
// app/layout.js
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

4. **Deploy**:
```bash
git add .
git commit -m "Add Vercel Analytics"
git push
```

**Risultato**: Analytics dashboard disponibile su Vercel

---

### 2. Vercel Speed Insights

**Per monitorare Core Web Vitals**:

```bash
npm install @vercel/speed-insights
```

```javascript
// app/layout.js
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

### 3. Google Analytics 4 (GA4)

**Quando usare**: Tracking avanzato, conversioni, ecommerce

**Setup**:

1. **Crea Property GA4**:
   - Vai su [analytics.google.com](https://analytics.google.com)
   - Admin → Create Property
   - Ottieni Measurement ID (es: `G-XXXXXXXXXX`)

2. **Install gtag script**:

Crea `components/GoogleAnalytics.jsx`:

```javascript
'use client'

import Script from 'next/script'

export default function GoogleAnalytics({ measurementId }) {
    return (
        <>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${measurementId}', {
                            page_path: window.location.pathname,
                        });
                    `,
                }}
            />
        </>
    )
}
```

3. **Usa nel layout**:

```javascript
// app/layout.js
import GoogleAnalytics from '../components/GoogleAnalytics'

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>
        {children}
        <GoogleAnalytics measurementId="G-XXXXXXXXXX" />
      </body>
    </html>
  );
}
```

**Best Practice**: Usa environment variable per il Measurement ID

```javascript
// .env.local
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

```javascript
<GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
```

---

### 4. Custom Event Tracking

**Track eventi specifici** (es: click su bottone, form submit):

```javascript
'use client'

export function trackEvent(eventName, eventParams = {}) {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, eventParams);
    }
}

// Uso:
import { trackEvent } from '@/lib/analytics'

<button onClick={() => trackEvent('contact_form_open', { 
    section: 'hero' 
})}>
    Contact Us
</button>
```

**Eventi comuni da tracciare**:
- `contact_form_submit`
- `project_view`
- `scroll_to_section`
- `external_link_click`
- `mobile_menu_open`

---

## Privacy & GDPR

### Cookie Consent

**Se usi GA4 in EU/IT, serve cookie banner**:

```bash
npm install react-cookie-consent
```

```javascript
// components/CookieConsent.jsx
'use client'

import CookieConsent from "react-cookie-consent";

export default function CookieBanner() {
    return (
        <CookieConsent
            location="bottom"
            buttonText="Accetta"
            declineButtonText="Rifiuta"
            enableDeclineButton
            cookieName="immagina_analytics_consent"
            style={{ background: "#111111", borderTop: "1px solid #E63946" }}
            buttonStyle={{ 
                color: "#111", 
                background: "#E63946",
                fontSize: "13px",
                borderRadius: "4px"
            }}
            declineButtonStyle={{
                background: "transparent",
                border: "1px solid white",
                color: "white"
            }}
            expires={365}
        >
            Utilizziamo cookie per migliorare la tua esperienza.{" "}
            <a href="/privacy" style={{ color: "#E63946" }}>
                Privacy Policy
            </a>
        </CookieConsent>
    );
}
```

**Conditional GA load**:

```javascript
// Solo se l'utente ha accettato
const consent = Cookies.get('immagina_analytics_consent');
if (consent === 'true') {
    // Load GA
}
```

---

## Metrics da Monitorare

### Traffic Metrics
- **Pageviews**: Visualizzazioni totali
- **Unique Visitors**: Visitatori unici
- **Session Duration**: Durata media sessione
- **Bounce Rate**: % visitatori che lasciano subito

### Engagement
- **Scroll Depth**: Quanto scorrono la pagina
- **Click Events**: Click su CTA, progetti, servizi
- **Video Views**: Se hai video
- **Form Submissions**: Invio form contatti

### Performance (da Speed Insights)
- **LCP**: Largest Contentful Paint
- **FID**: First Input Delay
- **CLS**: Cumulative Layout Shift
- **TTFB**: Time to First Byte

### Conversions (Goals in GA4)
- Contact form submit
- Email click
- Project inquiry
- Social media click

---

## Dashboard Custom

### Vercel Analytics

Disponibile direttamente su:
- `Dashboard → Project → Analytics`

Mostra:
- Real-time visitors
- Top pages
- Referrers
- Devices (desktop/mobile)

### Google Analytics 4

**Report utili**:
1. **Realtime**: Visitatori in tempo reale
2. **Acquisition**: Da dove arrivano (Google, social, direct)
3. **Engagement**: Pagine più viste
4. **Events**: Custom events tracciati

**Custom Dashboard**:
1. GA4 → Explore → Blank
2. Aggiungi metriche:
   - Sessions
   - Users
   - Pageviews
   - Conversions
3. Dimensioni:
   - Source/Medium
   - Page path
   - Device category

---

## Testing Analytics

### Pre-Production

**Vercel Analytics**: Automatic su preview deployments

**Google Analytics**:
```javascript
// Non caricare GA in development
{process.env.NODE_ENV === 'production' && (
    <GoogleAnalytics measurementId={...} />
)}
```

**Test eventi**:
1. Apri Console → Network
2. Trigger evento (es: click bottone)
3. Verifica richiesta a `google-analytics.com/collect`

**Real-time check**:
- GA4 → Realtime → Events
- Trigger evento sul sito
- Verifica che appaia in realtime

---

## Integration con Next.js App Router

### usePathname Hook (per tracciare page views)

```javascript
'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function AnalyticsPageView() {
    const pathname = usePathname()

    useEffect(() => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('config', 'G-XXXXXXXXXX', {
                page_path: pathname,
            });
        }
    }, [pathname])

    return null
}
```

Usa in layout:
```javascript
<AnalyticsPageView />
```

---

## Checklist Setup

- [ ] **Vercel Analytics** installato e attivo
- [ ] **Speed Insights** aggiunto
- [ ] **Google Analytics 4** (se necessario)
  - [ ] Property creata
  - [ ] Measurement ID configurato
  - [ ] Script gtag aggiunto
- [ ] **Cookie Consent** (se GA4 + EU)
- [ ] **Custom events** definiti
- [ ] **Environment variables** configurate
- [ ] **Testing** in production
- [ ] **Privacy Policy** aggiornata

---

## Privacy Policy

**Se usi GA, aggiungi sezione cookie**:

```markdown
## Cookie e Analytics

Utilizziamo Google Analytics per comprendere come i visitatori 
interagiscono con il nostro sito. I dati raccolti sono anonimi e 
non vengono condivisi con terze parti.

Puoi disabilitare il tracking installando 
[Google Analytics Opt-out Browser Add-on](https://tools.google.com/dlpage/gaoptout).
```

---

## Casi Limite

### Eventi Non Tracciati

**Sintomo**: Event non appare in GA

**Soluzione**:
- Verifica che `window.gtag` sia disponibile
- Check Network tab per richieste
- Usa GA Debug mode

### Doppie Pageviews

**Sintomo**: Ogni pagina conta 2x

**Soluzione**: Rimuovi duplicate gtag config calls

### GDPR Compliance

**Sintomo**: Serve gestire consenso

**Soluzione**: Implementa Cookie Consent banner

---

## Note

- **Vercel Analytics**: Best per quick start, privacy-friendly
- **Google Analytics**: Best per advanced tracking, conversioni
- **Entrambi**: Usa tutti e due per massima visibilità
- **Privacy**: Se target EU, gestisci consenso cookie

---

## Riferimenti

- [Vercel Analytics Docs](https://vercel.com/docs/analytics)
- [Google Analytics 4](https://support.google.com/analytics/answer/10089681)
- [Next.js Analytics](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)
