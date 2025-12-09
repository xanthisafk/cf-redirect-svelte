import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ cookies }) => {
        cookies.delete('token', { path: '/' });
        throw redirect(303, '/login');
    }
};
