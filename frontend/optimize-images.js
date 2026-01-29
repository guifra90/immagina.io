const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'public', 'images');

async function optimizeImages() {
    try {
        const files = fs.readdirSync(imagesDir);

        for (const file of files) {
            if (file.match(/\.(png|jpg|jpeg)$/i)) {
                const filePath = path.join(imagesDir, file);
                const stats = fs.statSync(filePath);

                // Only process files larger than 500KB or specific targets
                if (stats.size > 500 * 1024) {
                    console.log(`Optimizing ${file} (${(stats.size / 1024).toFixed(2)} KB)...`);

                    const image = sharp(filePath);
                    const metadata = await image.metadata();

                    // Resize if width is massive (e.g. > 1920)
                    if (metadata.width > 2000) {
                        image.resize({ width: 1920 });
                    }

                    // Compress based on type
                    if (file.endsWith('.png')) {
                        // High compression for PNG, effort 10
                        await image.png({ quality: 80, compressionLevel: 9 }).toFile(filePath + '.temp');
                    } else {
                        await image.jpeg({ quality: 80 }).toFile(filePath + '.temp');
                    }

                    // Replace original
                    fs.renameSync(filePath + '.temp', filePath);

                    const newStats = fs.statSync(filePath);
                    console.log(`-> Saved ${(stats.size - newStats.size) / 1024} KB`);
                }
            }
        }
    } catch (err) {
        console.error("Optimization failed:", err);
    }
}

optimizeImages();
