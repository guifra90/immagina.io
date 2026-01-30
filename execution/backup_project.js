#!/usr/bin/env node

/**
 * Backup Project
 * Descrizione: Crea un backup completo del progetto (code + assets)
 * Esclude node_modules, .next, e altri file temporanei
 * Uso: node execution/backup_project.js [--name=custom-name]
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_ROOT = path.join(__dirname, '..');
const BACKUP_DIR = path.join(PROJECT_ROOT, 'backups');

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
 * Parse arguments
 */
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        name: null,
        compress: true
    };

    args.forEach(arg => {
        if (arg.startsWith('--name=')) {
            options.name = arg.split('=')[1];
        } else if (arg === '--no-compress') {
            options.compress = false;
        }
    });

    return options;
}

/**
 * Get backup name
 */
function getBackupName(customName) {
    const timestamp = new Date().toISOString()
        .replace(/[:.]/g, '-')
        .replace('T', '_')
        .split('.')[0];

    return customName
        ? `${customName}_${timestamp}`
        : `immagina-backup_${timestamp}`;
}

/**
 * Get project stats
 */
function getProjectStats(dir) {
    let totalSize = 0;
    let fileCount = 0;

    function scan(directory) {
        const files = fs.readdirSync(directory);

        files.forEach(file => {
            const filePath = path.join(directory, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                // Skip excluded directories
                if (['node_modules', '.next', '.git', 'backups', '.tmp'].includes(file)) {
                    return;
                }
                scan(filePath);
            } else {
                totalSize += stat.size;
                fileCount++;
            }
        });
    }

    scan(dir);

    return { totalSize, fileCount };
}

/**
 * Format bytes
 */
function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

/**
 * Create .backupignore content
 */
function getBackupIgnore() {
    return `# Backup Ignore Patterns
node_modules/
.next/
.git/
backups/
.tmp/
*.log
.DS_Store
.env
.env.local
.vercel/
*.cache
coverage/
dist/
build/
.turbo/`;
}

/**
 * Copy directory with exclusions
 */
function copyDirectory(src, dest, excludePatterns) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });
    let copiedFiles = 0;

    entries.forEach(entry => {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        // Check if should be excluded
        const shouldExclude = excludePatterns.some(pattern => {
            if (pattern.endsWith('/')) {
                return entry.name === pattern.slice(0, -1) && entry.isDirectory();
            }
            return entry.name === pattern || entry.name.match(new RegExp(pattern));
        });

        if (shouldExclude) {
            return;
        }

        if (entry.isDirectory()) {
            copiedFiles += copyDirectory(srcPath, destPath, excludePatterns);
        } else {
            fs.copyFileSync(srcPath, destPath);
            copiedFiles++;
        }
    });

    return copiedFiles;
}

/**
 * Create backup metadata
 */
function createMetadata(backupName, stats) {
    return {
        name: backupName,
        timestamp: new Date().toISOString(),
        project: 'immagina.io',
        stats: {
            files: stats.fileCount,
            size: stats.totalSize,
            sizeFormatted: formatBytes(stats.totalSize)
        },
        environment: {
            node: process.version,
            platform: process.platform,
            arch: process.arch
        }
    };
}

/**
 * Main backup function
 */
async function backupProject() {
    const options = parseArgs();
    const backupName = getBackupName(options.name);

    log('💾 PROJECT BACKUP', 'blue');
    log('='.repeat(60), 'blue');
    log(`Backup name: ${backupName}`, 'blue');
    log('='.repeat(60) + '\n', 'blue');

    // Create backups directory
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
        log('Created backups directory', 'green');
    }

    const backupPath = path.join(BACKUP_DIR, backupName);

    // Get project stats
    log('Analyzing project...', 'blue');
    const stats = getProjectStats(PROJECT_ROOT);
    log(`Found ${stats.fileCount} files (${formatBytes(stats.totalSize)})\n`, 'blue');

    // Create backup directory
    fs.mkdirSync(backupPath, { recursive: true });

    // Copy project files
    log('Copying files...', 'blue');

    const excludePatterns = [
        'node_modules/',
        '.next/',
        '.git/',
        'backups/',
        '.tmp/',
        '.DS_Store',
        '*.log',
        '.env',
        '.env.local',
        '.vercel/',
        'coverage/',
        'dist/',
        'build/'
    ];

    const copiedFiles = copyDirectory(PROJECT_ROOT, backupPath, excludePatterns);

    log(`Copied ${copiedFiles} files`, 'green');

    // Create metadata file
    const metadata = createMetadata(backupName, stats);
    fs.writeFileSync(
        path.join(backupPath, 'backup-metadata.json'),
        JSON.stringify(metadata, null, 2)
    );

    // Create README
    const readme = `# Backup: ${backupName}

Created: ${new Date().toLocaleString('it-IT')}
Files: ${stats.fileCount}
Size: ${formatBytes(stats.totalSize)}

## Restore Instructions

1. Extract this backup to desired location
2. Navigate to frontend directory:
   \`\`\`bash
   cd frontend
   \`\`\`

3. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

4. Copy environment variables:
   \`\`\`bash
   cp .env.example .env.local
   # Add your API keys
   \`\`\`

5. Run development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Notes

- This backup excludes node_modules (reinstall with npm install)
- Environment variables (.env) are NOT included for security
- Git history is NOT included (backup is a snapshot)

---

Project: Immagina.io
Backup tool: execution/backup_project.js
`;

    fs.writeFileSync(path.join(backupPath, 'README.md'), readme);

    // Compress if requested
    let archivePath = null;
    if (options.compress) {
        log('\nCompressing backup...', 'blue');

        try {
            archivePath = `${backupPath}.tar.gz`;
            execSync(`tar -czf "${archivePath}" -C "${BACKUP_DIR}" "${backupName}"`, {
                stdio: 'ignore'
            });

            const archiveStats = fs.statSync(archivePath);
            const archiveSize = archiveStats.size;

            log(`Archive created: ${formatBytes(archiveSize)}`, 'green');

            // Remove uncompressed directory
            fs.rmSync(backupPath, { recursive: true, force: true });

        } catch (error) {
            log(`Warning: Compression failed (${error.message})`, 'yellow');
            log('Backup saved uncompressed', 'yellow');
        }
    }

    // Summary
    const finalPath = archivePath || backupPath;
    const finalStats = fs.statSync(finalPath);

    log('\n' + '='.repeat(60), 'blue');
    log('✅ BACKUP COMPLETE', 'green');
    log('='.repeat(60), 'blue');

    log(`\nLocation: ${finalPath}`, 'green');
    log(`Size: ${formatBytes(finalStats.size)}`, 'green');
    log(`Files: ${copiedFiles}`, 'green');

    // List all backups
    const allBackups = fs.readdirSync(BACKUP_DIR)
        .filter(f => f.startsWith('immagina-backup'))
        .map(f => {
            const stat = fs.statSync(path.join(BACKUP_DIR, f));
            return {
                name: f,
                size: stat.size,
                mtime: stat.mtime
            };
        })
        .sort((a, b) => b.mtime - a.mtime);

    if (allBackups.length > 1) {
        log('\n📦 All backups:', 'blue');
        allBackups.forEach(backup => {
            const date = backup.mtime.toLocaleString('it-IT');
            log(`  - ${backup.name} (${formatBytes(backup.size)}) - ${date}`);
        });

        // Suggest cleanup if too many
        if (allBackups.length > 5) {
            log(`\n💡 Tip: Consider deleting old backups (${allBackups.length} total)`, 'yellow');
        }
    }

    return {
        success: true,
        data: {
            backupPath: finalPath,
            files: copiedFiles,
            size: finalStats.size
        }
    };
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
    backupProject().then(result => {
        process.exit(result.success ? 0 : 1);
    }).catch(error => {
        log(`❌ Backup failed: ${error.message}`, 'red');
        process.exit(1);
    });
}

export { backupProject };
