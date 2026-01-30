#!/usr/bin/env node

/**
 * Compress All Images
 * Descrizione: Batch compression di tutte le immagini in public/images/
 * Usa Sharp per ottimizzazione lossless e conversione WebP
 * Uso: node execution/compress_all_images.js [--quality=80] [--webp]
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const IMAGES_DIR = path.join(__dirname, '../frontend/public/images');

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
 * Parse command line arguments
 */
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        quality: 80,
        webp: false,
        skipLarge: false
    };

    args.forEach(arg => {
        if (arg.startsWith('--quality=')) {
            options.quality = parseInt(arg.split('=')[1]);
        } else if (arg === '--webp') {
            options.webp = true;
        } else if (arg === '--skip-large') {
            options.skipLarge = true;
        }
    });

    return options;
}

/**
 * Get all images recursively
 */
function getImages(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            getImages(filePath, fileList);
        } else if (file.match(/\.(png|jpe?g)$/i)) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
    return (bytes / 1024).toFixed(2) + ' KB';
}

/**
 * Compress single image
 */
async function compressImage(filePath, options) {
    try {
        const originalStats = fs.statSync(filePath);
        const originalSize = originalStats.size;

        // Skip if already small and --skip-large is used
        if (options.skipLarge && originalSize < 500 * 1024) {
            return { skipped: true, originalSize };
        }

        const image = sharp(filePath);
        const metadata = await image.metadata();

        // Resize if too large (max 2000px width)
        if (metadata.width > 2000) {
            image.resize({ width: 2000 });
        }

        const ext = path.extname(filePath).toLowerCase();
        const tempPath = filePath + '.temp';

        // Compress based on format
        if (ext === '.png') {
            await image
                .png({
                    quality: options.quality,
                    compressionLevel: 9,
                    effort: 10
                })
                .toFile(tempPath);
        } else {
            await image
                .jpeg({
                    quality: options.quality,
                    mozjpeg: true
                })
                .toFile(tempPath);
        }

        // Replace original
        fs.renameSync(tempPath, filePath);

        const newStats = fs.statSync(filePath);
        const newSize = newStats.size;
        const savedBytes = originalSize - newSize;
        const savedPercent = ((savedBytes / originalSize) * 100).toFixed(1);

        // Generate WebP version if requested
        let webpPath = null;
        if (options.webp) {
            webpPath = filePath.replace(/\.(png|jpe?g)$/i, '.webp');
            await sharp(filePath)
                .webp({ quality: options.quality })
                .toFile(webpPath);
        }

        return {
            success: true,
            originalSize,
            newSize,
            savedBytes,
            savedPercent,
            webpPath
        };

    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Main compression function
 */
async function compressAllImages() {
    const options = parseArgs();

    log('🖼️  IMAGE COMPRESSION', 'blue');
    log('='.repeat(60), 'blue');
    log(`Quality: ${options.quality}`, 'blue');
    log(`WebP conversion: ${options.webp ? 'enabled' : 'disabled'}`, 'blue');
    log('='.repeat(60) + '\n', 'blue');

    if (!fs.existsSync(IMAGES_DIR)) {
        log(`❌ Images directory not found: ${IMAGES_DIR}`, 'red');
        return { success: false, error: 'Directory not found' };
    }

    const images = getImages(IMAGES_DIR);

    if (images.length === 0) {
        log('No images found to compress', 'yellow');
        return { success: true, data: { processed: 0 } };
    }

    log(`Found ${images.length} images to process\n`, 'blue');

    let totalOriginalSize = 0;
    let totalNewSize = 0;
    let processed = 0;
    let skipped = 0;
    let errors = 0;

    for (const imagePath of images) {
        const relativePath = path.relative(IMAGES_DIR, imagePath);
        const filename = path.basename(imagePath);

        process.stdout.write(`Processing: ${filename}...`);

        const result = await compressImage(imagePath, options);

        if (result.skipped) {
            process.stdout.write(' SKIPPED (already small)\n');
            skipped++;
            continue;
        }

        if (!result.success) {
            process.stdout.write(` ${colors.red}ERROR: ${result.error}${colors.reset}\n`);
            errors++;
            continue;
        }

        totalOriginalSize += result.originalSize;
        totalNewSize += result.newSize;
        processed++;

        const savedInfo = result.savedBytes > 0
            ? `${colors.green}-${formatBytes(result.savedBytes)} (${result.savedPercent}%)${colors.reset}`
            : 'no change';

        process.stdout.write(` ${savedInfo}`);

        if (result.webpPath) {
            process.stdout.write(` + WebP`);
        }

        process.stdout.write('\n');
    }

    // Summary
    log('\n' + '='.repeat(60), 'blue');
    log('📊 SUMMARY', 'blue');
    log('='.repeat(60), 'blue');

    const totalSaved = totalOriginalSize - totalNewSize;
    const totalPercent = totalOriginalSize > 0
        ? ((totalSaved / totalOriginalSize) * 100).toFixed(1)
        : 0;

    log(`\nProcessed: ${processed}`, 'green');
    if (skipped > 0) log(`Skipped: ${skipped}`, 'yellow');
    if (errors > 0) log(`Errors: ${errors}`, 'red');

    log(`\nOriginal size: ${formatBytes(totalOriginalSize)}`, 'reset');
    log(`New size: ${formatBytes(totalNewSize)}`, 'reset');
    log(`Total saved: ${formatBytes(totalSaved)} (${totalPercent}%)`, 'green');

    return {
        success: true,
        data: {
            processed,
            skipped,
            errors,
            totalOriginalSize,
            totalNewSize,
            totalSaved,
            totalPercent
        }
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

    compressAllImages().then(result => {
        process.exit(result.success ? 0 : 1);
    });
}

export { compressAllImages };
