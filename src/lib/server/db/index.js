import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

/**
 * Create a Drizzle D1 database instance
 * @param {D1Database} d1Database 
 * @returns {import('drizzle-orm/d1').DrizzleD1Database}
 */
export function createDb(d1Database) {
    return drizzle(d1Database, { schema });
}
