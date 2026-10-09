import fs from 'node:fs';
import sharp from 'sharp';
import type { Response } from 'express';

// Bounded memory cache: private previews never become public files.
const cache = new Map<string, Buffer>();
let cacheBytes = 0;
const maxBytes = 32 * 1024 * 1024;
let active = 0;

export async function sendPreview(file: string, res: Response, width = 1600): Promise<void> {
  try {
    const stat = fs.statSync(file);
    const key = `${file}:${stat.size}:${stat.mtimeMs}:${width}`;
    let bytes = cache.get(key);
    if (!bytes) {
      // Keep compression from consuming all CPU under concurrent traffic.
      if (active >= 2) { res.sendFile(file); return; }
      active++;
      try {
        bytes = await sharp(file).rotate().resize({ width, height: width, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 85, effort: 4 }).toBuffer();
      } finally { active--; }
      if (bytes.length >= stat.size) { res.sendFile(file); return; }
      if (bytes.length <= maxBytes && !cache.has(key)) {
        while (cacheBytes + bytes.length > maxBytes && cache.size) {
          const oldest = cache.keys().next().value!;
          cacheBytes -= cache.get(oldest)!.length;
          cache.delete(oldest);
        }
        cache.set(key, bytes);
        cacheBytes += bytes.length;
      }
    }
    res.type('webp').send(bytes);
  } catch (error) {
    // A malformed or unsupported image must not break the rest of the page.
    console.warn('Image preview unavailable:', file);
    res.sendFile(file);
  }
}
