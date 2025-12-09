import { links, link_visits, users, banned_items } from '$lib/server/db/schema';
import { eq, and, desc, isNull, isNotNull, sql } from 'drizzle-orm';

/**
 * Create a new short link
 * @param {import("drizzle-orm/d1").DrizzleD1Database} db
 * @param {string} userId 
 * @param {string} url 
 * @param {string} slug 
 * @param {string|null} title 
 * @param {string|null} expiresAt 
 * @returns {Promise<Object>}
 */
export async function createLink(db, userId, url, slug, title = null, expiresAt = null) {
    if (await isUrlBanned(db, url)) {
        throw new Error('This URL or domain is blacklisted not allowed.');
    }

    try {
        const [newLink] = await db.insert(links).values({
            user_id: userId,
            original_url: url,
            slug: slug,
            title: title,
            expires_at: expiresAt
        }).returning();
        return newLink;
    } catch (e) {
        if (e.message && e.message.includes('UNIQUE constraint failed')) {
            throw new Error('Slug already exists');
        }
        throw e;
    }
}

// Admin / Ban Logic

/**
 * Check if a URL or Domain is banned
 * @param {import("drizzle-orm/d1").DrizzleD1Database} db
 * @param {string} url 
 * @returns {Promise<boolean>}
 */
export async function isUrlBanned(db, url) {
    try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname;

        // Check exact URL
        const exactMatch = await db.select().from(banned_items).where(and(eq(banned_items.type, 'url'), eq(banned_items.value, url))).get();
        if (exactMatch) return true;

        // Check domain
        const domainMatch = await db.select().from(banned_items).where(and(eq(banned_items.type, 'domain'), eq(banned_items.value, domain))).get();
        if (domainMatch) return true;

        return false;
    } catch (e) {
        return false; // Invalid URL, maybe handle validation elsewhere
    }
}

export async function banItem(db, type, value, reason) {
    await db.insert(banned_items).values({ type, value, reason });
}

export async function banUser(db, userId) {
    await db.transaction(async (tx) => {
        await tx.update(users).set({ is_banned: true }).where(eq(users.id, userId));
        await tx.update(links).set({ is_active: false }).where(eq(links.user_id, userId));
    });
}

export async function getAllUsers(db) {
    return await db.select({
        id: users.id,
        username: users.username,
        role: users.role,
        is_banned: users.is_banned,
        created_at: users.created_at
    }).from(users).orderBy(desc(users.created_at));
}

/**
 * Get all links for a user (excluding soft deleted ones by default)
 * @param {import("drizzle-orm/d1").DrizzleD1Database} db
 * @param {string} userId 
 * @returns {Promise<Array>}
 */
export async function getUserLinks(db, userId) {
    return await db.select()
        .from(links)
        .where(
            and(
                eq(links.user_id, userId),
                isNull(links.deleted_at)
            )
        )
        .orderBy(desc(links.created_at));
}

/**
 * Get all deleted links for a user (Recycle Bin)
 * @param {import("drizzle-orm/d1").DrizzleD1Database} db
 * @param {string} userId 
 * @returns {Promise<Array>}
 */
export async function getUserDeletedLinks(db, userId) {
    return await db.select()
        .from(links)
        .where(
            and(
                eq(links.user_id, userId),
                isNotNull(links.deleted_at)
            )
        )
        .orderBy(desc(links.deleted_at));
}

/**
 * Get a link by slug
 * @param {import("drizzle-orm/d1").DrizzleD1Database} db
 * @param {string} slug 
 * @returns {Promise<Object|null>}
 */
export async function getLinkBySlug(db, slug) {
    const link = await db.select().from(links).where(eq(links.slug, slug)).get();
    return link;
}

/**
 * Soft delete a link
 * @param {import("drizzle-orm/d1").DrizzleD1Database} db
 * @param {string} userId 
 * @param {string} linkId 
 */
export async function softDeleteLink(db, userId, linkId) {
    await db.update(links)
        .set({ deleted_at: new Date().toISOString() })
        .where(and(eq(links.id, linkId), eq(links.user_id, userId)));
}

/**
 * Restore a link
 * @param {import("drizzle-orm/d1").DrizzleD1Database} db
 * @param {string} userId 
 * @param {string} linkId 
 */
export async function restoreLink(db, userId, linkId) {
    await db.update(links)
        .set({ deleted_at: null })
        .where(and(eq(links.id, linkId), eq(links.user_id, userId)));
}

/**
 * Hard delete a link
 * @param {import("drizzle-orm/d1").DrizzleD1Database} db
 * @param {string} userId 
 * @param {string} linkId 
 */
export async function hardDeleteLink(db, userId, linkId) {
    await db.delete(links).where(and(eq(links.id, linkId), eq(links.user_id, userId)));
}

/**
 * Hard delete a link (Admin)
 * @param {import("drizzle-orm/d1").DrizzleD1Database} db
 * @param {string} linkId 
 */
export async function adminDeleteLink(db, linkId) {
    await db.delete(links).where(eq(links.id, linkId));
}

/**
 * Record a visit
 * @param {import("drizzle-orm/d1").DrizzleD1Database} db
 * @param {string} linkId 
 */
export async function recordVisit(db, linkId, metadata = {}) {
    await db.transaction(async (tx) => {
        await tx.insert(link_visits).values({
            link_id: linkId,
            country: metadata.country || null,
            region: metadata.region || null,
            city: metadata.city || null,
            device: metadata.device || null,
            os: metadata.os || null,
            browser: metadata.browser || null,
            referrer: metadata.referrer || null
        });
        await tx.update(links)
            .set({ views: sql`${links.views} + 1` })
            .where(eq(links.id, linkId));
    });
}

/**
 * Get all links (Admin)
 * @param {import("drizzle-orm/d1").DrizzleD1Database} db
 * @returns {Promise<Array>}
 */
export async function getAllLinks(db) {
    return await db.select()
        .from(links)
        .orderBy(desc(links.created_at));
}

/**
 * Update a link
 * @param {import("drizzle-orm/d1").DrizzleD1Database} db
 * @param {string} userId
 * @param {string} linkId
 * @param {string} url
 * @param {string} slug
 * @param {string|null} title
 * @param {string|null} expiresAt
 */
export async function updateLink(db, userId, linkId, url, slug, title = null, expiresAt = null) {
    if (await isUrlBanned(db, url)) {
        throw new Error('This URL or domain is blacklisted not allowed.');
    }

    try {
        await db.update(links)
            .set({
                original_url: url,
                slug: slug,
                title: title,
                expires_at: expiresAt
            })
            .where(and(eq(links.id, linkId), eq(links.user_id, userId)));
    } catch (e) {
        if (e.message && e.message.includes('UNIQUE constraint failed')) {
            throw new Error('Slug already exists');
        }
        throw e;
    }
}
