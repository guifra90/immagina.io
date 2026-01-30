#!/usr/bin/env node

/**
 * Generate Favicons
 * Descrizione: Genera set completo di favicon da un'immagine sorgente
 * Crea tutte le dimensioni necessarie per web, iOS, Android
 * Uso: node execution/generate_favicons.js [source-image.png]
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '../frontend/public');

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
 * Favicon sizes to generate
 */
const FAVICON_SIZES = [
    // Standard favicon
    { name: 'favicon.ico', size: 32, format: 'png' },
    { name: 'favicon-16x16.png', size: 16, format: 'png' },
    { name: 'favicon-32x32.png', size: 32, format: 'png' },

    // Apple Touch Icons
    { name: 'apple-touch-icon.png', size: 180, format: 'png' },
    { name: 'apple-touch-icon-57x57.png', size: 57, format: 'png' },
    { name: 'apple-touch-icon-60x60.png', size: 60, format: 'png' },
    { name: 'apple-touch-icon-72x72.png', size: 72, format: 'png' },
    { name: 'apple-touch-icon-76x76.png', size: 76, format: 'png' },
    { name: 'apple-touch-icon-114x114.png', size: 114, format: 'png' },
    { name: 'apple-touch-icon-120x120.png', size: 120, format: 'png' },
    { name: 'apple-touch-icon-144x144.png', size: 144, format: 'png' },
    { name: 'apple-touch-icon-152x152.png', size: 152, format: 'png' },
    { name: 'apple-touch-icon-180x180.png', size: 180, format: 'png' },

    // Android Chrome
    { name: 'android-chrome-192x192.png', size: 192, format: 'png' },
    { name: 'android-chrome-512x512.png', size: 512, format: 'png' },

    // PWA Icons
    { name: 'icon-192.png', size: 192, format: 'png' },
    { name: 'icon-512.png', size: 512, format: 'png' },

    // Microsoft
    { name: 'mstile-70x70.png', size: 70, format: 'png' },
    { name: 'mstile-144x144.png', size: 144, format: 'png' },
    { name: 'mstile-150x150.png', size: 150, format: 'png' },
    { name: 'mstile-310x150.png', size: 310, width: 310, height: 150, format: 'png' },
    { name: 'mstile-310x310.png', size: 310, format: 'png' },
];

/**
 * Generate single favicon
 */
async function generateFavicon(sourceImage, config, outputDir) {
    try {
        const outputPath = path.join(outputDir, config.name);

        let image = sharp(sourceImage);

        // Resize
        if (config.width && config.height) {
            image = image.resize(config.width, config.height, {
                fit: 'cover',
                position: 'center'
            });
        } else {
            image = image.resize(config.size, config.size, {
                fit: 'cover',
                position: 'center'
            });
        }

        // Convert to format
        if (config.format === 'png') {
            image = image.png({ quality: 100 });
        }

        await image.toFile(outputPath);

        return { success: true, path: outputPath };

    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Generate browserconfig.xml for Microsoft
 */
function generateBrowserConfig() {
    return `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square70x70logo src="/mstile-70x70.png"/>
            <square150x150logo src="/mstile-150x150.png"/>
            <square310x310logo src="/mstile-310x310.png"/>
            <wide310x150logo src="/mstile-310x150.png"/>
            <TileColor>#E63946</TileColor>
        </tile>
    </msapplication>
</browserconfig>`;
}

/**
 * Generate site.webmanifest
 */
function generateWebManifest() {
    return JSON.stringify({
        "name": "Immagina.io",
        "short_name": "Immagina",
        "icons": [
            {
                "src": "/android-chrome-192x192.png",
                "sizes": "192x192",
                "type": "image/png"
            },
            {
                "src": "/android-chrome-512x512.png",
                "sizes": "512x512",
                "type": "image/png"
            }
        ],
        "theme_color": "#E63946",
        "background_color": "#111111",
        "display": "standalone"
    }, null, 2);
}

/**
 * Generate HTML snippet for head
 */
function generateHTMLSnippet() {
    return `<!-- Favicon & App Icons -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#E63946">
<meta name="msapplication-TileColor" content="#E63946">
<meta name="msapplication-config" content="/browserconfig.xml">
<meta name="theme-color" content="#E63946">`;
}

/**
 * Main generation function
 */
async function generateFavicons(sourcePath) {
    log('🎨 FAVICON GENERATOR', 'blue');
    log('='.repeat(60), 'blue');

    // Determine source image
    if (!sourcePath) {
        // Try to find logo in public
        const possiblePaths = [
            path.join(PUBLIC_DIR, 'logo.png'),
            path.join(PUBLIC_DIR, 'logo.svg'),
            path.join(PUBLIC_DIR, 'images/logo.png'),
        ];

        sourcePath = possiblePaths.find(p => fs.existsSync(p));

        if (!sourcePath) {
            log('❌ No source image provided and no logo.png found in public/', 'red');
            log('Usage: node generate_favicons.js [source-image.png]', 'yellow');
            return { success: false };
        }
    }

    if (!fs.existsSync(sourcePath)) {
        log(`❌ Source image not found: ${sourcePath}`, 'red');
        return { success: false };
    }

    log(`Source: ${sourcePath}`, 'blue');
    log(`Output: ${PUBLIC_DIR}\n`, 'blue');

    let generated = 0;
    let errors = 0;

    // Generate all favicon sizes
    for (const config of FAVICON_SIZES) {
        process.stdout.write(`Generating ${config.name}...`);

        const result = await generateFavicon(sourcePath, config, PUBLIC_DIR);

        if (result.success) {
            process.stdout.write(` ${colors.green}✓${colors.reset}\n`);
            generated++;
        } else {
            process.stdout.write(` ${colors.red}✗ ${result.error}${colors.reset}\n`);
            errors++;
        }
    }

    // Generate config files
    process.stdout.write('Generating browserconfig.xml...');
    fs.writeFileSync(
        path.join(PUBLIC_DIR, 'browserconfig.xml'),
        generateBrowserConfig()
    );
    process.stdout.write(` ${colors.green}✓${colors.reset}\n`);

    process.stdout.write('Generating site.webmanifest...');
    fs.writeFileSync(
        path.join(PUBLIC_DIR, 'site.webmanifest'),
        generateWebManifest()
    );
    process.stdout.write(` ${colors.green}✓${colors.reset}\n`);

    // Save HTML snippet
    const snippetPath = path.join(__dirname, '../.tmp/favicon-html-snippet.txt');
    const tmpDir = path.join(__dirname, '../.tmp');

    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
    }

    fs.writeFileSync(snippetPath, generateHTMLSnippet());

    // Summary
    log('\n' + '='.repeat(60), 'blue');
    log('📊 SUMMARY', 'blue');
    log('='.repeat(60), 'blue');

    log(`\nGenerated: ${generated} favicons`, 'green');
    log(`Config files: 2 (browserconfig.xml, site.webmanifest)`, 'green');
    if (errors > 0) log(`Errors: ${errors}`, 'red');

    log('\n💡 Next steps:', 'blue');
    log('  1. Add HTML snippet to app/layout.js (saved in .tmp/favicon-html-snippet.txt)');
    log('  2. Verify favicons work on different devices');
    log('  3. Test PWA install on mobile');

    return {
        success: true,
        data: { generated, errors }
    };
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
    // Check if sharp is installed
    try {
        await import('sharp');
    } catch (error) {
        log('❌ Sharp not installed. Run: npm install sharp', 'red');
        process.exit(1);
    }

    const sourcePath = process.argv[2];

    generateFavicons(sourcePath).then(result => {
        process.exit(result.success ? 0 : 1);
    });
}

export { generateFavicons };
