import { verifyToken } from '$lib/server/auth';
import { createDb } from '$lib/server/db';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    // Initialize DB
    if (event.platform?.env?.DB) {
        event.locals.db = createDb(event.platform.env.DB);
    }

    const jwtSecret = event.platform?.env?.JWT_SECRET || process.env['JWT_SECRET']; // Fallback for dev if needed
    if (jwtSecret) {
        event.locals.jwt_secret = jwtSecret;
    }

    const token = event.cookies.get('token');

    if (token && jwtSecret) {
        const payload = verifyToken(token, jwtSecret);
        if (payload) {
            event.locals.user = payload;
        }
    }

    const response = await resolve(event);
    return response;
}
