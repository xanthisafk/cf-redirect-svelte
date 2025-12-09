import { db } from "$lib/server/db";
import { users, sessions } from "../schema";
import * as argon2 from "argon2";

export async function createNewUser(username, password) {
    const hash = await argon2.hash(password);

    try {
        await db.insert(users).values({
            username,
            password: hash
        });
    } catch (err) {
        console.error(err);
        return false;
    }

    return true;
}


export async function loginUser(username, password) {
    const result = await db.select()
        .from(users)
        .where({ username })
        .limit(1);

    const user = result[0];
    if (!user) return null;

    const isValid = await argon2.verify(user.password, password);
    if (!isValid) return null;

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    const [session] = await db.insert(sessions).values({
        user_id: user.id,
        expires_at: expiresAt.toISOString()
    }).returning();

    return session.id;
}

export async function logoutUser(sessionId) {
    await db.delete(sessions)
        .where({ id: sessionId });
}

