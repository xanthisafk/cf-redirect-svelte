import Database from 'better-sqlite3';

const db = new Database('local.db');

// Get all tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();

console.log('Found tables:', tables.map(t => t.name));

// Check if we need to disable foreign keys first
db.pragma('foreign_keys = OFF');

// Drop each table
for (const table of tables) {
    console.log(`Dropping table ${table.name}...`);
    try {
        db.prepare(`DROP TABLE IF EXISTS "${table.name}"`).run();
    } catch (e) {
        console.error(`Error dropping ${table.name}:`, e.message);
    }
}

console.log('All tables dropped. Schema reset.');
db.close();
