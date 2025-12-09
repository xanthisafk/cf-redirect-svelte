import { fail, redirect } from '@sveltejs/kit';
import { getUserLinks, getUserDeletedLinks, createLink, softDeleteLink, restoreLink, hardDeleteLink, updateLink } from '$lib/server/links';
import { generateTOTPSecret } from '$lib/server/auth'; // If needed for settings, but focus on links first

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    const links = await getUserLinks(locals.db, locals.user.id);
    const deletedLinks = await getUserDeletedLinks(locals.db, locals.user.id);

    return {
        links,
        deletedLinks
    };
}

/** @type {import('./$types').Actions} */
export const actions = {
    create: async ({ request, locals }) => {
        if (!locals.user) return fail(401);

        const data = await request.formData();
        const url = data.get('url');
        let slug = data.get('slug');
        const title = data.get('title');
        const expiresAt = data.get('expires_at') || null;

        if (!url) return fail(400, { missing: true });

        // Generate random slug if empty
        if (!slug) {
            slug = Math.random().toString(36).substring(2, 8);
        }

        try {
            await createLink(locals.db, locals.user.id, url, slug, title, expiresAt);
        } catch (e) {
            return fail(400, { message: e.message });
        }

        return { success: true };
    },

    edit: async ({ request, locals }) => {
        if (!locals.user) return fail(401);
        const data = await request.formData();
        const linkId = data.get('id');
        const url = data.get('url');
        const slug = data.get('slug');
        const title = data.get('title');
        const expiresAt = data.get('expires_at') || null;

        if (!linkId || !url || !slug) return fail(400, { missing: true });

        try {
            await updateLink(locals.db, locals.user.id, linkId, url, slug, title, expiresAt);
        } catch (e) {
            return fail(400, { message: e.message });
        }

        return { success: true };
    },

    delete: async ({ request, locals }) => {
        if (!locals.user) return fail(401);
        const data = await request.formData();
        const linkId = data.get('id');

        await softDeleteLink(locals.db, locals.user.id, linkId);
        return { success: true };
    },

    restore: async ({ request, locals }) => {
        if (!locals.user) return fail(401);
        const data = await request.formData();
        const linkId = data.get('id');

        await restoreLink(locals.db, locals.user.id, linkId);
        return { success: true };
    },

    // Optional: Hard delete from bin
    destroy: async ({ request, locals }) => {
        if (!locals.user) return fail(401);
        const data = await request.formData();
        const linkId = data.get('id');

        await hardDeleteLink(locals.db, locals.user.id, linkId);
        return { success: true };
    }
};
