# Esempio di Direttiva

## Obiettivo
Questa è una direttiva di esempio che mostra la struttura standard per le SOP.
Descrive come eseguire un'operazione specifica utilizzando gli script in `execution/`.

## Input
- **parametro1** (string): Descrizione del primo parametro
- **parametro2** (number): Descrizione del secondo parametro
- **opzioni** (object, opzionale): Configurazioni aggiuntive

## Tool da Utilizzare
Script da eseguire: `execution/example_script.js`

```bash
node execution/example_script.js <parametro1> <parametro2>
```

## Output
- **success** (boolean): Indica se l'operazione è riuscita
- **data** (object): Dati risultanti dall'operazione
- **error** (string, opzionale): Messaggio di errore se presente

Formato output:
```json
{
  "success": true,
  "data": {
    "result": "valore"
  }
}
```

## Processo
1. Validare gli input forniti
2. Caricare le variabili d'ambiente necessarie da `.env`
3. Eseguire lo script con i parametri
4. Verificare l'output e gestire eventuali errori
5. Restituire il risultato all'utente o al sistema

## Casi Limite

### Errore: Parametri mancanti
**Sintomo**: Lo script restituisce un errore di validazione
**Soluzione**: Verificare che tutti i parametri obbligatori siano forniti

### Errore: API rate limit
**Sintomo**: Errore 429 dalla chiamata API
**Soluzione**: Implementare retry con backoff esponenziale (già gestito nello script)

### Errore: Credenziali non valide
**Sintomo**: Errore 401 o 403
**Soluzione**: Verificare che le chiavi API in `.env` siano corrette e valide

## Note
- Questo script richiede una connessione internet attiva
- Il tempo di esecuzione tipico è di 2-5 secondi
- I risultati vengono cachati in `.tmp/` per 1 ora
- Aggiornato: 2026-01-28 - Aggiunto supporto per batch processing

## Lezioni Apprese
- **2026-01-28**: Scoperto che l'API ha un limite di 100 richieste/minuto
- **2026-01-28**: Il batch endpoint è più efficiente per > 10 items
