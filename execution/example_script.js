#!/usr/bin/env node

/**
 * Example Script
 * Descrizione: Questo è uno script di esempio che mostra la struttura standard
 * per gli script deterministici in execution/
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Carica variabili d'ambiente
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: `${__dirname}/../.env` });

/**
 * Valida gli input forniti
 * @param {string} param1 - Primo parametro
 * @param {number} param2 - Secondo parametro
 * @returns {object} - Risultato della validazione
 */
function validateInputs(param1, param2) {
    const errors = [];

    if (!param1 || typeof param1 !== 'string') {
        errors.push('param1 deve essere una stringa non vuota');
    }

    if (!param2 || isNaN(param2)) {
        errors.push('param2 deve essere un numero valido');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Elabora i dati
 * @param {string} param1 - Primo parametro
 * @param {number} param2 - Secondo parametro
 * @returns {Promise<object>} - Risultato dell'elaborazione
 */
async function processData(param1, param2) {
    // Simula elaborazione asincrona
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                processed: true,
                input1: param1,
                input2: param2,
                result: `Elaborato: ${param1} con valore ${param2}`
            });
        }, 100);
    });
}

/**
 * Funzione principale
 * @param {string} param1 - Primo parametro
 * @param {string} param2 - Secondo parametro (verrà convertito in number)
 * @returns {Promise<object>} - Risultato dell'operazione
 */
async function main(param1, param2) {
    try {
        // Converti param2 in numero
        const numParam2 = Number(param2);

        // Valida input
        const validation = validateInputs(param1, numParam2);
        if (!validation.valid) {
            return {
                success: false,
                error: 'Errori di validazione',
                details: validation.errors
            };
        }

        // Elabora dati
        const result = await processData(param1, numParam2);

        return {
            success: true,
            data: result
        };

    } catch (error) {
        console.error('Errore durante l\'esecuzione:', error.message);
        return {
            success: false,
            error: error.message,
            stack: error.stack
        };
    }
}

// Esegui se chiamato direttamente
if (import.meta.url === `file://${process.argv[1]}`) {
    const param1 = process.argv[2];
    const param2 = process.argv[3];

    if (!param1 || !param2) {
        console.error('Uso: node example_script.js <param1> <param2>');
        process.exit(1);
    }

    const result = await main(param1, param2);
    console.log(JSON.stringify(result, null, 2));

    // Exit con codice appropriato
    process.exit(result.success ? 0 : 1);
}

export { main };
