#!/usr/bin/env node

/**
 * Performance Monitor
 * Descrizione: Esegue audit Lighthouse e monitora performance metrics
 * Salva report storici per tracking nel tempo
 * Uso: node execution/performance_monitor.js [url]
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const REPORTS_DIR = path.join(__dirname, '../.tmp/performance-reports');

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
 * Ottiene score color
 */
function getScoreColor(score) {
    if (score >= 90) return 'green';
    if (score >= 50) return 'yellow';
    return 'red';
}

/**
 * Formatta score con emoji
 */
function formatScore(score, label) {
    const color = getScoreColor(score);
    const emoji = score >= 90 ? '✅' : score >= 50 ? '⚠️' : '❌';
    return `${emoji} ${label}: ${colors[color]}${score}${colors.reset}`;
}

/**
 * Esegue Lighthouse audit
 */
function runLighthouse(url) {
    try {
        log(`\n🔍 Running Lighthouse audit on ${url}...`, 'blue');

        // Crea directory reports se non esiste
        if (!fs.existsSync(REPORTS_DIR)) {
            fs.mkdirSync(REPORTS_DIR, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportPath = path.join(REPORTS_DIR, `lighthouse-${timestamp}.json`);

        // Run Lighthouse
        const command = `npx lighthouse ${url} --output=json --output-path=${reportPath} --chrome-flags="--headless" --quiet`;

        log('Running audit... (this may take 1-2 minutes)', 'blue');
        execSync(command, { stdio: 'ignore' });

        // Read report
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

        return {
            success: true,
            data: {
                reportPath,
                scores: {
                    performance: Math.round(report.categories.performance.score * 100),
                    accessibility: Math.round(report.categories.accessibility.score * 100),
                    bestPractices: Math.round(report.categories['best-practices'].score * 100),
                    seo: Math.round(report.categories.seo.score * 100),
                },
                metrics: {
                    fcp: report.audits['first-contentful-paint'].displayValue,
                    lcp: report.audits['largest-contentful-paint'].displayValue,
                    tbt: report.audits['total-blocking-time'].displayValue,
                    cls: report.audits['cumulative-layout-shift'].displayValue,
                    tti: report.audits['interactive'].displayValue,
                },
                timestamp: new Date().toISOString()
            }
        };

    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Visualizza risultati
 */
function displayResults(result) {
    if (!result.success) {
        log(`\n❌ Audit failed: ${result.error}`, 'red');
        return;
    }

    const { scores, metrics, reportPath } = result.data;

    log('\n' + '='.repeat(50), 'blue');
    log('📊 LIGHTHOUSE SCORES', 'blue');
    log('='.repeat(50), 'blue');

    console.log('\n' + formatScore(scores.performance, 'Performance     '));
    console.log(formatScore(scores.accessibility, 'Accessibility   '));
    console.log(formatScore(scores.bestPractices, 'Best Practices  '));
    console.log(formatScore(scores.seo, 'SEO             '));

    log('\n' + '='.repeat(50), 'blue');
    log('⚡ CORE WEB VITALS', 'blue');
    log('='.repeat(50), 'blue');

    console.log(`\nFCP (First Contentful Paint):    ${metrics.fcp}`);
    console.log(`LCP (Largest Contentful Paint):  ${metrics.lcp}`);
    console.log(`TBT (Total Blocking Time):       ${metrics.tbt}`);
    console.log(`CLS (Cumulative Layout Shift):   ${metrics.cls}`);
    console.log(`TTI (Time to Interactive):       ${metrics.tti}`);

    log('\n' + '='.repeat(50), 'blue');

    // Overall assessment
    const avgScore = Math.round(
        (scores.performance + scores.accessibility + scores.bestPractices + scores.seo) / 4
    );

    if (avgScore >= 90) {
        log('\n🎉 Excellent! Site is well optimized.', 'green');
    } else if (avgScore >= 70) {
        log('\n👍 Good, but there\'s room for improvement.', 'yellow');
    } else {
        log('\n⚠️  Needs optimization work.', 'red');
    }

    log(`\n📄 Full report saved: ${reportPath}`, 'blue');
}

/**
 * Salva summary storico
 */
function saveHistoricalData(result) {
    if (!result.success) return;

    const historyPath = path.join(REPORTS_DIR, 'history.json');

    let history = [];
    if (fs.existsSync(historyPath)) {
        history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
    }

    history.push({
        timestamp: result.data.timestamp,
        scores: result.data.scores,
        metrics: result.data.metrics
    });

    // Keep last 20 reports
    if (history.length > 20) {
        history = history.slice(-20);
    }

    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
}

/**
 * Mostra trend (se ci sono dati storici)
 */
function showTrend() {
    const historyPath = path.join(REPORTS_DIR, 'history.json');

    if (!fs.existsSync(historyPath)) {
        return;
    }

    const history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));

    if (history.length < 2) {
        return;
    }

    const latest = history[history.length - 1];
    const previous = history[history.length - 2];

    log('\n📈 TREND (vs previous audit)', 'blue');

    const categories = ['performance', 'accessibility', 'bestPractices', 'seo'];

    categories.forEach(cat => {
        const diff = latest.scores[cat] - previous.scores[cat];
        const arrow = diff > 0 ? '↗️' : diff < 0 ? '↘️' : '→';
        const color = diff > 0 ? 'green' : diff < 0 ? 'red' : 'reset';

        log(`  ${arrow} ${cat}: ${colors[color]}${diff > 0 ? '+' : ''}${diff}${colors.reset}`, color);
    });
}

/**
 * Main
 */
async function performanceMonitor(url) {
    // Default to localhost if no URL provided
    url = url || 'http://localhost:3000';

    log('🚀 PERFORMANCE MONITOR', 'blue');
    log(`Target: ${url}\n`, 'blue');

    const result = runLighthouse(url);

    displayResults(result);

    if (result.success) {
        saveHistoricalData(result);
        showTrend();
    }

    return result;
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
    const url = process.argv[2];

    performanceMonitor(url).then(result => {
        process.exit(result.success ? 0 : 1);
    });
}

export { performanceMonitor };
