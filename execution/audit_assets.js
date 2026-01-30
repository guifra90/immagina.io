#!/usr/bin/env node

/**
 * Asset Audit
 * Descrizione: Verifica la presenza di tutti gli asset referenziati nel codice
 * Controlla che tutte le immagini esistano e identifica asset mancanti
 * Uso: node execution/audit_assets.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const FRONTEND_DIR = path.join(__dirname, '../frontend');
const PUBLIC_IMAGES_DIR = path.join(FRONTEND_DIR, 'public/images');
const COMPONENTS_DIR = path.join(FRONTEND_DIR, 'components');
const APP_DIR = path.join(FRONTEND_DIR, 'app');

/**
 * Estrae i riferimenti alle immagini dal codice
 */
function extractImageReferences(content) {
    const references = [];

    // Pattern per src="..." o src={...}
    const srcPattern = /src=["'{]([^"'}]+)["'}]/g;
    let match;

    while ((match = srcPattern.exec(content)) !== null) {
        const src = match[1];
        // Solo immagini locali in /images/
        if (src.startsWith('/images/') || src.includes('images/')) {
            references.push(src.replace('/images/', '').replace('images/', ''));
        }
    }

    return references;
}

/**
 * Scansiona ricorsivamente una directory per file .jsx/.js
 */
function scanDirectory(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Salta node_modules e .next
            if (file !== 'node_modules' && file !== '.next') {
                scanDirectory(filePath, fileList);
            }
        } else if (file.match(/\.(jsx?|tsx?)$/)) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

/**
 * Ottiene tutti gli asset fisici presenti
 */
function getExistingAssets() {
    if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
        return [];
    }

    return fs.readdirSync(PUBLIC_IMAGES_DIR)
        .filter(file => file.match(/\.(png|jpe?g|gif|svg|webp)$/i));
}

/**
 * Esegue l'audit
 */
function auditAssets() {
    try {
        console.log('🔍 Scanning codebase for image references...\n');

        // Scansiona tutti i file
        const allFiles = [
            ...scanDirectory(COMPONENTS_DIR),
            ...scanDirectory(APP_DIR)
        ];

        // Estrai tutti i riferimenti
        const allReferences = new Set();
        const referencesByFile = {};

        allFiles.forEach(filePath => {
            const content = fs.readFileSync(filePath, 'utf8');
            const refs = extractImageReferences(content);

            if (refs.length > 0) {
                const relativePath = path.relative(FRONTEND_DIR, filePath);
                referencesByFile[relativePath] = refs;
                refs.forEach(ref => allReferences.add(ref));
            }
        });

        // Ottieni asset esistenti
        const existingAssets = getExistingAssets();

        // Identifica asset mancanti
        const missingAssets = [];
        const foundAssets = [];

        allReferences.forEach(ref => {
            if (existingAssets.includes(ref)) {
                foundAssets.push(ref);
            } else {
                missingAssets.push(ref);
            }
        });

        // Identifica asset non usati
        const unusedAssets = existingAssets.filter(asset => !allReferences.has(asset));

        // Report
        const report = {
            summary: {
                totalReferences: allReferences.size,
                totalAssets: existingAssets.length,
                missing: missingAssets.length,
                unused: unusedAssets.length,
                found: foundAssets.length
            },
            missingAssets,
            unusedAssets,
            referencesByFile
        };

        // Output console
        console.log('📊 ASSET AUDIT REPORT\n');
        console.log(`Total image references in code: ${report.summary.totalReferences}`);
        console.log(`Total physical assets: ${report.summary.totalAssets}`);
        console.log(`✅ Found: ${report.summary.found}`);
        console.log(`❌ Missing: ${report.summary.missing}`);
        console.log(`⚠️  Unused: ${report.summary.unused}\n`);

        if (missingAssets.length > 0) {
            console.log('❌ MISSING ASSETS:');
            missingAssets.forEach(asset => {
                console.log(`  - ${asset}`);
                // Trova dove è referenziato
                Object.entries(referencesByFile).forEach(([file, refs]) => {
                    if (refs.includes(asset)) {
                        console.log(`    Referenced in: ${file}`);
                    }
                });
            });
            console.log('');
        }

        if (unusedAssets.length > 0) {
            console.log('⚠️  UNUSED ASSETS (not referenced in code):');
            unusedAssets.forEach(asset => {
                const filePath = path.join(PUBLIC_IMAGES_DIR, asset);
                const stats = fs.statSync(filePath);
                const sizeKB = (stats.size / 1024).toFixed(2);
                console.log(`  - ${asset} (${sizeKB} KB)`);
            });
            console.log('');
        }

        // Salva report JSON
        const reportPath = path.join(__dirname, '../.tmp/asset-audit-report.json');
        const tmpDir = path.join(__dirname, '../.tmp');

        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }

        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`📄 Full report saved to: ${reportPath}\n`);

        return {
            success: true,
            data: report
        };

    } catch (error) {
        return {
            success: false,
            error: error.message,
            stack: error.stack
        };
    }
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
    const result = auditAssets();

    if (!result.success) {
        console.error('❌ Audit failed:', result.error);
        process.exit(1);
    }

    // Exit with error code if there are missing assets
    const hasMissing = result.data.summary.missing > 0;
    process.exit(hasMissing ? 1 : 0);
}

export { auditAssets };
