import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
    if (locals.user) {
        throw redirect(302, '/dashboard');
    }

    return {
        promoMode: env.PROMO_MODE || 'public'
    };
}
