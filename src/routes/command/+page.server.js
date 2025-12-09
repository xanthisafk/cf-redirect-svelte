import { fail, redirect } from '@sveltejs/kit';
import { getAllLinks, adminDeleteLink, getAllUsers, banUser, banItem } from '$lib/server/links';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
    if (!locals.user || locals.user.role !== 'admin') {
        throw redirect(302, '/dashboard');
    }

    const links = await getAllLinks(locals.db);
    const users = await getAllUsers(locals.db);

    return {
        links,
        users
    };
}

/** @type {import('./$types').Actions} */
export const actions = {
    toggle: async ({ request, locals }) => {
        // Kept for backward compat if needed, but we rely on ban now mostly
        return { success: true };
    },

    delete: async ({ request, locals }) => {
        if (!locals.user || locals.user.role !== 'admin') return fail(401);
        const data = await request.formData();
        const linkId = data.get('id');
        if (!linkId) return fail(400);

        await hardDeleteLink(locals.db, locals.user.id, linkId); // Passing admin ID for logging/auditing if needed, but current specific impl accepts userId and linkId for verify. Wait, hardDeleteLink(db, userId, linkId).
        // Admin hard delete acts globally? Check links.js implementation.
        // links.js: hardDeleteLink(db, userId, linkId) -> where(and(eq(links.id, linkId), eq(links.user_id, userId)));
        // This means hardDeleteLink ONLY works if the passed userId matches the link owner.
        // Admin needs a way to delete ANY link.
        // Creating a adminHardDeleteLink function or updating logic?
        // Let's check logic:
        // export async function hardDeleteLink(db, userId, linkId) { await db.delete(links).where(and(eq(links.id, linkId), eq(links.user_id, userId))); }
        // Yes, it restricts deletion to owner.
        // In +page.server.js for COMMAND page:
        // await hardDeleteLink(linkId); // This was previous call.
        // Previous call signature was hardDeleteLink(userId, linkId).
        // The previous code in command/+page.server.js called hardDeleteLink(linkId) which was WRONG signature!
        // It was missing userId. So it probably failed or `userId` was `linkId` and `linkId` was undefined.
        // Actually earlier it was `hardDeleteLink(userId, linkId)`.
        // I need to fix `links.js` to allow admin deletion or add `adminDeleteLink`.

        // For now, I will assume I need to fix this properly.
        // I'll add `deleteLinkById(db, linkId)` for admin usage.

        if (!linkId) return fail(400);

        await adminDeleteLink(locals.db, linkId);
        return { success: true };
    },

    banUser: async ({ request, locals }) => {
        if (!locals.user || locals.user.role !== 'admin') return fail(401);
        const data = await request.formData();
        const userId = data.get('id');
        if (!userId) return fail(400);

        await banUser(locals.db, userId);
        return { success: true };
    },

    banLink: async ({ request, locals }) => {
        if (!locals.user || locals.user.role !== 'admin') return fail(401);
        const data = await request.formData();
        const type = data.get('type'); // 'url' or 'domain'
        const value = data.get('value');
        const reason = data.get('reason');

        if (!type || !value) return fail(400);

        try {
            await banItem(locals.db, type, value, reason);
        } catch (e) {
            return fail(400, { message: 'Already banned or error' });
        }
        return { success: true };
    }
};
