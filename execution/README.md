# Execution Directory

Questa directory contiene gli **script JavaScript deterministici** che costituiscono il **Livello 3: Esecuzione** dell'architettura.

## Scopo

Gli script in questa directory gestiscono:
- Chiamate API
- Elaborazione dati
- Operazioni su file
- Interazioni con database
- Qualsiasi logica deterministica che richiede affidabilità

## Principi

- **Deterministici**: Stesso input → stesso output
- **Affidabili**: Gestione errori robusta
- **Testabili**: Facili da testare e debuggare
- **Veloci**: Ottimizzati per performance
- **Ben commentati**: Codice chiaro e documentato

## Struttura Script

Ogni script dovrebbe:
1. Importare le dipendenze necessarie
2. Caricare variabili d'ambiente da `.env`
3. Definire funzioni chiare e modulari
4. Gestire errori in modo esplicito
5. Fornire output strutturati (JSON quando possibile)
6. Includere commenti esplicativi

## Esempio di Script

```javascript
// execution/example_script.js
// Descrizione: Questo script fa X usando Y

import dotenv from 'dotenv';
dotenv.config();

/**
 * Funzione principale
 * @param {string} input - Descrizione input
 * @returns {object} - Descrizione output
 */
async function main(input) {
  try {
    // Logica dello script
    const result = await processData(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Errore:', error.message);
    return { success: false, error: error.message };
  }
}

// Esegui se chiamato direttamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const input = process.argv[2];
  const result = await main(input);
  console.log(JSON.stringify(result, null, 2));
}

export { main };
```

## Variabili d'Ambiente

Gli script accedono a chiavi API e configurazioni tramite `.env`:

```javascript
const API_KEY = process.env.API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;
```

## Best Practices

- Usa `async/await` per operazioni asincrone
- Valida gli input prima di processarli
- Logga errori in modo dettagliato
- Restituisci sempre un oggetto strutturato
- Testa gli script in isolamento prima di integrarli
