import { error, redirect } from '@sveltejs/kit';
import { getLinkBySlug } from '$lib/server/links';
import { link_visits } from '$lib/server/db/schema';
import { eq, sql, desc } from 'drizzle-orm';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals }) {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    const db = locals.db;
    const { slug } = params;
    const link = await getLinkBySlug(db, slug);

    if (!link) {
        throw error(404, 'Link not found');
    }

    // Security check: Only owner or admin can view details
    if (link.user_id !== locals.user.id && locals.user.role !== 'admin') {
        throw error(403, 'Unauthorized');
    }

    // Aggregate Data
    // We'll fetch raw counts for now, grouped by relevant columns.
    // Drizzle aggregation:

    const browsers = await db.select({
        name: link_visits.browser,
        count: sql`count(*)`.mapWith(Number)
    })
        .from(link_visits)
        .where(eq(link_visits.link_id, link.id))
        .groupBy(link_visits.browser)
        .orderBy(desc(sql`count(*)`));

    const os = await db.select({
        name: link_visits.os,
        count: sql`count(*)`.mapWith(Number)
    })
        .from(link_visits)
        .where(eq(link_visits.link_id, link.id))
        .groupBy(link_visits.os)
        .orderBy(desc(sql`count(*)`));

    const devices = await db.select({
        name: link_visits.device,
        count: sql`count(*)`.mapWith(Number)
    })
        .from(link_visits)
        .where(eq(link_visits.link_id, link.id))
        .groupBy(link_visits.device)
        .orderBy(desc(sql`count(*)`));

    const countries = await db.select({
        name: link_visits.country,
        count: sql`count(*)`.mapWith(Number)
    })
        .from(link_visits)
        .where(eq(link_visits.link_id, link.id))
        .groupBy(link_visits.country)
        .orderBy(desc(sql`count(*)`));

    // Recent Visits (Last 50)
    const recent = await db.select()
        .from(link_visits)
        .where(eq(link_visits.link_id, link.id))
        .orderBy(desc(link_visits.created_at))
        .limit(50);

    return {
        link,
        stats: {
            browsers,
            os,
            devices,
            countries,
            recent
        }
    };
}
