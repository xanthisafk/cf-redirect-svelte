// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            db: import('drizzle-orm/d1').DrizzleD1Database;
            jwt_secret: string;
            user: {
                id: string;
                username: string;
                role: string;
            } | null;
        }
        // interface PageData {}
        // interface PageState {}
        interface Platform {
            env: {
                DB: D1Database;
            };
            context: {
                waitUntil(promise: Promise<any>): void;
            };
            caches: CacheStorage & { default: Cache };
        }
    }
}

export { };
