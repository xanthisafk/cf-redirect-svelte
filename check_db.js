import { resolve } from 'path';
import { readdir } from 'fs/promises';
import Database from 'better-sqlite3';

async function findDb() {
    const wranglerDir = resolve('.wrangler/state/v3/d1/miniflare-D1DatabaseObject');
    // Try to find the .sqlite file
    try {
        const files = await readdir(wranglerDir);
        const dbFile = files.find(f => f.endsWith('.sqlite'));
        if (dbFile) return resolve(wranglerDir, dbFile);
    } catch (e) {
        // ignore
    }
    return null;
}

// Fallback search since path might vary
async function findDbRecursive(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = resolve(dir, entry.name);
        if (entry.isDirectory()) {
            const found = await findDbRecursive(fullPath);
            if (found) return found;
        } else if (entry.name.endsWith('.sqlite')) {
            return fullPath;
        }
    }
    return null;
}


async function main() {
    let dbPath = await findDbRecursive('.wrangler');

    if (!dbPath) {
        console.log("Could not find .sqlite file");
        return;
    }

    console.log(`Found DB at: ${dbPath}`);
    const db = new Database(dbPath);

    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log("Tables:", tables.map(t => t.name));

    db.close();
}

main();
