# Immagina.io Project

Progetto basato su architettura a 3 livelli per massimizzare affidabilità e separazione delle responsabilità.

## Struttura del Progetto

```
project-root/
├── directives/       # SOP in Markdown (Livello 1: Cosa fare)
├── execution/        # Script JavaScript deterministici (Livello 3: Esecuzione)
├── frontend/         # App Next.js
│   ├── app/         # Next.js App Router
│   ├── components/  # Componenti React
│   └── public/      # Asset statici
├── .tmp/            # File intermedi (non committare)
├── .env             # Variabili d'ambiente
└── GEMINI.md        # Istruzioni per l'agente AI
```

## Stack Tecnologico

- **Frontend**: Next.js + React + Tailwind CSS + Framer Motion (JavaScript)
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **API**: Next.js API Routes + Supabase Client

## Architettura a 3 Livelli

1. **Direttive** (`directives/`): SOP che definiscono obiettivi, input, tool, output e casi limite
2. **Orchestrazione**: L'agente AI legge le direttive e coordina l'esecuzione
3. **Esecuzione** (`execution/`): Script deterministici che eseguono il lavoro effettivo

## Setup

1. Installa le dipendenze del frontend:
   ```bash
   cd frontend
   npm install
   ```

2. Configura le variabili d'ambiente in `.env`

3. Avvia il server di sviluppo:
   ```bash
   cd frontend
   npm run dev
   ```

## Principi Operativi

- **Controlla prima i tool esistenti**: Prima di creare nuovi script, verifica in `execution/`
- **Auto-correzione**: Quando qualcosa si rompe, correggi, testa, aggiorna la direttiva
- **Direttive vive**: Aggiorna le direttive con ciò che impari (limiti API, best practices, ecc.)

## Note

- I file in `.tmp/` sono temporanei e possono essere rigenerati
- Le credenziali OAuth Google (`credentials.json`, `token.json`) non vanno committate
- I deliverable finali vivono nei servizi cloud (Google Sheets, Slides, ecc.)
