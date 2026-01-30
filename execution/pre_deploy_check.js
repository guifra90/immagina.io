#!/usr/bin/env node

/**
 * Pre-Deploy Checks
 * Descrizione: Esegue una serie di controlli prima del deploy
 * - Verifica che il build passi
 * - Controlla che non ci siano console.log
 * - Verifica presenza di asset critici
 * - Controlla metadata SEO
 * Uso: node execution/pre_deploy_check.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const FRONTEND_DIR = path.join(__dirname, '../frontend');
const COMPONENTS_DIR = path.join(FRONTEND_DIR, 'components');
const APP_DIR = path.join(FRONTEND_DIR, 'app');

/**
 * Colori per output
 */
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Check 1: Lint
 */
function checkLint() {
    log('\n1️⃣  Running ESLint...', 'blue');
    try {
        execSync('npm run lint', {
            cwd: FRONTEND_DIR,
            stdio: 'inherit'
        });
        log('✅ Lint passed', 'green');
        return { passed: true };
    } catch (error) {
        log('❌ Lint failed', 'red');
        return { passed: false, error: 'Lint errors found' };
    }
}

/**
 * Check 2: Build
 */
function checkBuild() {
    log('\n2️⃣  Testing production build...', 'blue');
    try {
        execSync('npm run build', {
            cwd: FRONTEND_DIR,
            stdio: 'inherit'
        });
        log('✅ Build successful', 'green');
        return { passed: true };
    } catch (error) {
        log('❌ Build failed', 'red');
        return { passed: false, error: 'Build errors' };
    }
}

/**
 * Check 3: Console.log cleanup
 */
function checkConsoleLogs() {
    log('\n3️⃣  Checking for console.log...', 'blue');

    const findConsoleLogs = (dir) => {
        const files = fs.readdirSync(dir);
        const findings = [];

        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory() && file !== 'node_modules' && file !== '.next') {
                findings.push(...findConsoleLogs(filePath));
            } else if (file.match(/\.(jsx?|tsx?)$/)) {
                const content = fs.readFileSync(filePath, 'utf8');
                const lines = content.split('\n');

                lines.forEach((line, index) => {
                    // Skip comments
                    if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
                        return;
                    }

                    if (line.includes('console.log') || line.includes('console.error')) {
                        findings.push({
                            file: path.relative(FRONTEND_DIR, filePath),
                            line: index + 1,
                            content: line.trim()
                        });
                    }
                });
            }
        });

        return findings;
    };

    const consoleLogs = [
        ...findConsoleLogs(COMPONENTS_DIR),
        ...findConsoleLogs(APP_DIR)
    ];

    if (consoleLogs.length === 0) {
        log('✅ No console.log found', 'green');
        return { passed: true };
    } else {
        log(`⚠️  Found ${consoleLogs.length} console.log statements:`, 'yellow');
        consoleLogs.forEach(({ file, line, content }) => {
            console.log(`  ${file}:${line} - ${content}`);
        });
        return { passed: false, warning: true, findings: consoleLogs };
    }
}

/**
 * Check 4: SEO Metadata
 */
function checkSEOMetadata() {
    log('\n4️⃣  Checking SEO metadata...', 'blue');

    const layoutPath = path.join(APP_DIR, 'layout.js');

    if (!fs.existsSync(layoutPath)) {
        log('❌ layout.js not found', 'red');
        return { passed: false };
    }

    const content = fs.readFileSync(layoutPath, 'utf8');
    const issues = [];

    if (!content.includes('export const metadata')) {
        issues.push('Missing metadata export');
    }

    if (!content.includes('title')) {
        issues.push('Missing title in metadata');
    }

    if (!content.includes('description')) {
        issues.push('Missing description in metadata');
    }

    if (issues.length === 0) {
        log('✅ SEO metadata looks good', 'green');
        return { passed: true };
    } else {
        log('⚠️  SEO issues found:', 'yellow');
        issues.forEach(issue => console.log(`  - ${issue}`));
        return { passed: false, warning: true, issues };
    }
}

/**
 * Check 5: Critical Assets
 */
function checkCriticalAssets() {
    log('\n5️⃣  Checking critical assets...', 'blue');

    const criticalAssets = [
        'images/hero-vr-glass.png',
        'images/branding-image.png'
    ];

    const missing = [];

    criticalAssets.forEach(asset => {
        const assetPath = path.join(FRONTEND_DIR, 'public', asset);
        if (!fs.existsSync(assetPath)) {
            missing.push(asset);
        }
    });

    if (missing.length === 0) {
        log('✅ All critical assets found', 'green');
        return { passed: true };
    } else {
        log('❌ Missing critical assets:', 'red');
        missing.forEach(asset => console.log(`  - ${asset}`));
        return { passed: false, missing };
    }
}

/**
 * Main check runner
 */
async function runPreDeployChecks() {
    log('🚀 PRE-DEPLOY CHECKS', 'blue');
    log('='.repeat(50), 'blue');

    const results = {
        lint: checkLint(),
        build: checkBuild(),
        consoleLogs: checkConsoleLogs(),
        seo: checkSEOMetadata(),
        assets: checkCriticalAssets()
    };

    // Summary
    log('\n' + '='.repeat(50), 'blue');
    log('📊 SUMMARY', 'blue');

    const passed = Object.values(results).filter(r => r.passed).length;
    const total = Object.keys(results).length;
    const warnings = Object.values(results).filter(r => r.warning).length;

    log(`\nPassed: ${passed}/${total}`, passed === total ? 'green' : 'yellow');

    if (warnings > 0) {
        log(`Warnings: ${warnings}`, 'yellow');
    }

    const allPassed = passed === total;

    if (allPassed) {
        log('\n✅ All checks passed! Ready to deploy.', 'green');
    } else {
        log('\n❌ Some checks failed. Fix issues before deploying.', 'red');
    }

    return {
        success: allPassed,
        results,
        summary: { passed, total, warnings }
    };
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
    runPreDeployChecks().then(result => {
        process.exit(result.success ? 0 : 1);
    });
}

export { runPreDeployChecks };
