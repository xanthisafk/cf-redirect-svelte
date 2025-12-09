import { fail, redirect } from '@sveltejs/kit';
import { users } from '$lib/server/db/schema';
import { verifyPassword, generateToken } from '$lib/server/auth';
import { eq } from 'drizzle-orm';

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ request, cookies, locals }) => {
        const db = locals.db;
        const data = await request.formData();
        const username = data.get('username');
        const password = data.get('password');

        if (!username || !password) {
            return fail(400, { username, missing: true });
        }

        let user;
        try {
            user = await db.select().from(users).where(eq(users.username, username)).get();
        } catch (e) {
            return fail(500, { message: 'Database error' });
        }

        if (!user || !user.password_hash) {
            return fail(400, { username, incorrect: true });
        }

        const valid = await verifyPassword(user.password_hash, password);

        if (!valid) {
            return fail(400, { username, incorrect: true });
        }

        // Generate JWT
        const token = generateToken({
            id: user.id,
            username: user.username,
            role: user.role
        }, locals.jwt_secret);

        // Set Cookie
        cookies.set('token', token, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            sameSite: 'lax'
        });

        throw redirect(303, '/dashboard');
    }
};
