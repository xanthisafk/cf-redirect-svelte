import { redirect, error } from '@sveltejs/kit';
import { getLinkBySlug, recordVisit } from '$lib/server/links';
import { env } from '$env/dynamic/private';
import { UAParser } from 'ua-parser-js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, platform, request, locals }) {
    const { slug } = params;

    // Check if db is available (should be in locals)
    if (!locals.db) {
        // Fallback or error if critical? If D1 is down, we die.
        // Although +server.js runs in the same context as hooks, so it should be there.
    }
    const db = locals.db;

    const link = await getLinkBySlug(db, slug);

    if (!link) {
        throw error(404, 'Link not found');
    }

    if (link.deleted_at) {
        throw error(410, 'Link has been deleted'); // Gone
    }

    if (link.expires_at && new Date(link.expires_at) < new Date()) {
        throw error(410, 'Link has expired');
    }

    if (!link.is_active) {
        throw error(403, 'Link has been disabled by administrator');
    }

    // Analytics Collection
    const metadata = {};

    // Location
    if (env.TRACK_LOCATION === 'true') {
        metadata.country = request.headers.get('cf-ipcountry') || 'Unknown';
        metadata.region = request.headers.get('cf-region') || 'Unknown';
        metadata.city = request.headers.get('cf-ipcity') || 'Unknown';
    }

    // User Agent (Device, OS, Browser)
    const uaString = request.headers.get('user-agent');
    if (uaString && (env.TRACK_DEVICE === 'true' || env.TRACK_OS === 'true' || env.TRACK_BROWSER === 'true')) {
        const parser = new UAParser(uaString);
        const result = parser.getResult();

        if (env.TRACK_DEVICE === 'true') metadata.device = result.device.type || 'Desktop';
        if (env.TRACK_OS === 'true') metadata.os = result.os.name || 'Unknown';
        if (env.TRACK_BROWSER === 'true') metadata.browser = result.browser.name || 'Unknown';
    }

    // Referrer
    if (env.TRACK_REFERRER === 'true') {
        metadata.referrer = request.headers.get('referer') || 'Direct';
    }

    const visitPromise = recordVisit(db, link.id, metadata).catch(err => {
        console.error('Failed to record visit:', err);
    });

    if (platform && platform.context && platform.context.waitUntil) {
        platform.context.waitUntil(visitPromise);
    } else {
        // Fallback for local dev or if platform is missing
        await visitPromise;
    }

    throw redirect(302, link.original_url);
}
