import { fail, redirect } from '@sveltejs/kit';
import { users } from '$lib/server/db/schema';
import { hashPassword } from '$lib/server/auth';
import { eq } from 'drizzle-orm';

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ request, locals }) => {
        const db = locals.db;
        const data = await request.formData();
        const username = data.get('username');
        const password = data.get('password');
        const passwordConfirm = data.get('passwordConfirm');

        if (!username || !password || !passwordConfirm) {
            return fail(400, { username, missing: true });
        }

        if (password !== passwordConfirm) {
            return fail(400, { username, match: false });
        }

        if (password.length < 8) {
            return fail(400, { username, short: true });
        }

        try {
            // Check if user exists
            const existingUser = await db.select().from(users).where(eq(users.username, username)).get();
            if (existingUser) {
                return fail(400, { username, exists: true });
            }

            const hashedPassword = await hashPassword(password);

            await db.insert(users).values({
                username,
                password_hash: hashedPassword
            });

        } catch (error) {
            console.error(error);
            return fail(500, { message: 'Internal Server Error' });
        }

        throw redirect(303, '/login');
    }
};
