# Directives Directory

Questa directory contiene le **SOP (Standard Operating Procedures)** scritte in Markdown che definiscono il **Livello 1: Direttive** dell'architettura.

## Scopo

Le direttive sono istruzioni in linguaggio naturale che definiscono:
- **Obiettivi**: Cosa deve essere fatto
- **Input**: Quali dati/parametri sono necessari
- **Tool/Script**: Quali script in `execution/` utilizzare
- **Output**: Cosa viene prodotto
- **Casi limite**: Gestione errori e situazioni particolari

## Formato

Ogni direttiva dovrebbe seguire questa struttura:

```markdown
# [Nome della Direttiva]

## Obiettivo
Descrizione chiara di cosa deve essere fatto.

## Input
- Parametro 1: descrizione
- Parametro 2: descrizione

## Tool da Utilizzare
Script in `execution/` da eseguire: `execution/nome_script.js`

## Output
Descrizione del risultato atteso.

## Casi Limite
- Errore 1: come gestirlo
- Errore 2: come gestirlo

## Note
Informazioni aggiuntive, limiti API, timing, ecc.
```

## Principi

- **Documenti vivi**: Aggiorna le direttive quando scopri nuove informazioni
- **Chiarezza**: Scrivi come se stessi istruendo un dipendente di medio livello
- **Completezza**: Includi tutti i casi limite e le lezioni apprese
- **Preservazione**: Non sovrascrivere direttive senza motivo, migliorale nel tempo

## Esempi di Direttive

- `create_animation.md` - Come creare animazioni per il frontend
- `create_chart.md` - Come generare grafici e visualizzazioni
- `api_integration.md` - Come integrare API esterne
- `database_operations.md` - Come eseguire operazioni sul database
