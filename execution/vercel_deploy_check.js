#!/usr/bin/env node

/**
 * Vercel Deploy Pre-Check Script
 * 
 * Automatizza tutti i controlli necessari prima di fare il deploy su Vercel
 * per evitare errori comuni e garantire un deployment pulito.
 * 
 * Usage: node execution/vercel_deploy_check.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FRONTEND_PATH = path.join(__dirname, '../frontend');

// Colors for terminal output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(message) {
    console.log('\n' + '='.repeat(60));
    log(message, 'blue');
    console.log('='.repeat(60) + '\n');
}

function success(message) {
    log(`✅ ${message}`, 'green');
}

function error(message) {
    log(`❌ ${message}`, 'red');
}

function warning(message) {
    log(`⚠️  ${message}`, 'yellow');
}

function info(message) {
    log(`ℹ️  ${message}`, 'blue');
}

let hasErrors = false;
let hasWarnings = false;

/**
 * Check 1: Verifica next.config.js
 */
function checkNextConfig() {
    header('Check 1: Next.js Configuration');

    const configPath = path.join(FRONTEND_PATH, 'next.config.js');

    if (!fs.existsSync(configPath)) {
        error('next.config.js non trovato!');
        hasErrors = true;
        return;
    }

    const configContent = fs.readFileSync(configPath, 'utf8');

    // Check per configurazioni problematiche
    const badPatterns = [
        { pattern: /output:\s*['"](export|standalone)['"]/g, message: 'output: "export" trovato! Rimuovi per Vercel deploy' },
        { pattern: /trailingSlash:\s*true/g, message: 'trailingSlash: true trovato! Rimuovi per Vercel deploy' },
        { pattern: /unoptimized:\s*true/g, message: 'images.unoptimized: true trovato! Rimuovi per Vercel deploy' },
    ];

    let configErrors = false;
    badPatterns.forEach(({ pattern, message }) => {
        if (pattern.test(configContent)) {
            error(message);
            configErrors = true;
        }
    });

    if (configErrors) {
        hasErrors = true;
        info('Configurazione corretta dovrebbe essere:');
        console.log(`
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: [],
    },
}
        `);
    } else {
        success('next.config.js configurato correttamente');
    }
}

/**
 * Check 2: Verifica .npmrc
 */
function checkNpmrc() {
    header('Check 2: NPM Configuration');

    const npmrcPath = path.join(FRONTEND_PATH, '.npmrc');

    if (!fs.existsSync(npmrcPath)) {
        error('.npmrc non trovato!');
        info('Crea .npmrc con: echo "legacy-peer-deps=true" > frontend/.npmrc');
        hasErrors = true;
        return;
    }

    const npmrcContent = fs.readFileSync(npmrcPath, 'utf8');

    if (!npmrcContent.includes('legacy-peer-deps=true')) {
        error('.npmrc non contiene "legacy-peer-deps=true"');
        hasErrors = true;
    } else {
        success('.npmrc configurato correttamente');
    }
}

/**
 * Check 3: Verifica vercel.json
 */
function checkVercelJson() {
    header('Check 3: Vercel Configuration');

    const vercelJsonPath = path.join(FRONTEND_PATH, 'vercel.json');

    if (!fs.existsSync(vercelJsonPath)) {
        warning('vercel.json non trovato (opzionale, ma consigliato)');
        hasWarnings = true;
        return;
    }

    const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));

    // Check per configurazioni problematiche
    if (vercelConfig.buildCommand) {
        error('buildCommand trovato in vercel.json! Rimuovi e lascia auto-detect');
        hasErrors = true;
    }

    if (vercelConfig.outputDirectory) {
        error('outputDirectory trovato in vercel.json! Rimuovi completamente');
        hasErrors = true;
    }

    if (vercelConfig.framework !== 'nextjs') {
        error('framework non è "nextjs" in vercel.json');
        hasErrors = true;
    } else {
        success('vercel.json configurato correttamente');
    }
}

/**
 * Check 4: Verifica file SEO
 */
function checkSeoFiles() {
    header('Check 4: SEO Files');

    const seoFiles = [
        { path: 'public/robots.txt', name: 'robots.txt' },
        { path: 'public/sitemap.xml', name: 'sitemap.xml' },
    ];

    seoFiles.forEach(({ path: filePath, name }) => {
        const fullPath = path.join(FRONTEND_PATH, filePath);
        if (fs.existsSync(fullPath)) {
            success(`${name} presente`);
        } else {
            warning(`${name} mancante (opzionale per SEO)`);
            hasWarnings = true;
        }
    });
}

/**
 * Check 5: Verifica Three.js components
 */
function checkThreeJsComponents() {
    header('Check 5: Three.js Components');

    const heroCanvasPath = path.join(FRONTEND_PATH, 'components/HeroCanvas.jsx');

    if (!fs.existsSync(heroCanvasPath)) {
        info('HeroCanvas.jsx non trovato (OK se non usato)');
        return;
    }

    const content = fs.readFileSync(heroCanvasPath, 'utf8');

    // Check se è disabilitato
    if (content.includes('return null') && content.includes('Temporarily disabled')) {
        success('HeroCanvas disabilitato correttamente (evita crash in produzione)');
    } else if (content.includes('<Canvas')) {
        warning('HeroCanvas è ABILITATO - potrebbe causare crash in produzione!');
        info('Se vedi errori "isPrimaryRenderer", disabilita il componente');
        hasWarnings = true;
    }
}

/**
 * Check 6: Build test
 */
function checkBuild() {
    header('Check 6: Build Test');

    info('Esecuzione build test locale (può richiedere 30-60 secondi)...');

    try {
        const startTime = Date.now();

        // Pulisci build precedenti
        const nextPath = path.join(FRONTEND_PATH, '.next');
        if (fs.existsSync(nextPath)) {
            fs.rmSync(nextPath, { recursive: true, force: true });
        }

        // Esegui build
        execSync('npm run build', {
            cwd: FRONTEND_PATH,
            stdio: 'pipe'
        });

        const buildTime = ((Date.now() - startTime) / 1000).toFixed(1);

        if (buildTime < 10) {
            error(`Build troppo veloce (${buildTime}s) - possibile problema!`);
            hasErrors = true;
        } else {
            success(`Build completato in ${buildTime}s`);
        }

        // Verifica che .next esista
        if (!fs.existsSync(nextPath)) {
            error('Directory .next/ non creata dal build!');
            hasErrors = true;
        } else {
            success('Directory .next/ creata correttamente');
        }

    } catch (err) {
        error('Build fallito!');
        console.error(err.message);
        hasErrors = true;
    }
}

/**
 * Check 7: Console.log check
 */
function checkConsoleLogs() {
    header('Check 7: Console Logs');

    const excludeDirs = ['node_modules', '.next', 'out', '.vercel', '.git'];
    const fileExtensions = ['.js', '.jsx', '.ts', '.tsx'];

    function searchDirectory(dir) {
        const files = fs.readdirSync(dir);
        let found = [];

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                if (!excludeDirs.includes(file)) {
                    found = found.concat(searchDirectory(filePath));
                }
            } else if (fileExtensions.some(ext => file.endsWith(ext))) {
                const content = fs.readFileSync(filePath, 'utf8');
                const lines = content.split('\n');

                lines.forEach((line, index) => {
                    if (line.match(/console\.(log|warn|error|debug|info)/)) {
                        found.push({
                            file: path.relative(FRONTEND_PATH, filePath),
                            line: index + 1,
                            content: line.trim()
                        });
                    }
                });
            }
        }

        return found;
    }

    const consoleLogs = searchDirectory(FRONTEND_PATH);

    if (consoleLogs.length > 0) {
        warning(`Trovati ${consoleLogs.length} console.log nel codice`);
        consoleLogs.slice(0, 5).forEach(({ file, line, content }) => {
            console.log(`  ${file}:${line} - ${content.substring(0, 60)}`);
        });
        if (consoleLogs.length > 5) {
            console.log(`  ... e altri ${consoleLogs.length - 5}`);
        }
        hasWarnings = true;
    } else {
        success('Nessun console.log trovato nel codice');
    }
}

/**
 * Check 8: Package.json dependencies
 */
function checkDependencies() {
    header('Check 8: Dependencies');

    const packageJsonPath = path.join(FRONTEND_PATH, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Check versioni critiche
    const criticalDeps = {
        'next': packageJson.dependencies.next,
        'react': packageJson.dependencies.react,
        '@react-three/fiber': packageJson.dependencies['@react-three/fiber'],
        '@react-three/drei': packageJson.dependencies['@react-three/drei'],
    };

    info('Versioni dipendenze critiche:');
    Object.entries(criticalDeps).forEach(([name, version]) => {
        if (version) {
            console.log(`  ${name}: ${version}`);
        }
    });

    // Check engines
    if (packageJson.engines && packageJson.engines.node) {
        success(`Node version specificata: ${packageJson.engines.node}`);
    } else {
        warning('Node version non specificata in package.json');
        hasWarnings = true;
    }
}

/**
 * Main execution
 */
function main() {
    console.log('\n');
    log('🚀 Vercel Deploy Pre-Check Script', 'magenta');
    log('Verifica automatica configurazione prima del deploy\n', 'magenta');

    // Verifica che siamo nella directory corretta
    if (!fs.existsSync(FRONTEND_PATH)) {
        error('Directory frontend/ non trovata!');
        process.exit(1);
    }

    // Esegui tutti i check
    checkNextConfig();
    checkNpmrc();
    checkVercelJson();
    checkSeoFiles();
    checkThreeJsComponents();
    checkDependencies();
    checkConsoleLogs();
    checkBuild();

    // Summary
    header('Summary');

    if (hasErrors) {
        error('CI SONO ERRORI CHE DEVONO ESSERE RISOLTI PRIMA DEL DEPLOY!');
        info('Correggi gli errori sopra e ri-esegui questo script');
        process.exit(1);
    } else if (hasWarnings) {
        warning('Ci sono alcuni warning, ma puoi procedere con il deploy');
        info('Considera di risolvere i warning per un deploy ottimale');
        console.log('\n');
        success('✨ Pronto per il deploy! Esegui: npx vercel --prod');
        process.exit(0);
    } else {
        success('🎉 TUTTO OK! Nessun errore o warning trovato');
        console.log('\n');
        success('✨ Pronto per il deploy! Esegui: npx vercel --prod');
        process.exit(0);
    }
}

// Run
main();
