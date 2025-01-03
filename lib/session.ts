import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.JWT_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export type SessionPayload = {
    id: string;
    email: string;
    role: string;
    expiresAt: Date;
};

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(payload.expiresAt)
        .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch (error) {
        console.log("Failed to verify session");
        return null;
    }
}

export async function createSession(token: SessionPayload) {
    const session = await encrypt(token);

    (await cookies()).set("session", session, {
        httpOnly: true,
        secure: true,
        expires: token.expiresAt,
        sameSite: "lax",
        path: "/",
    });
}

export async function verifySession() {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);
    if (!session) {
        console.log("Invalid session");
        return null;
    }
    return session.id;
}

export async function updateSession() {
    const session = (await cookies()).get("session")?.value;
    const payload = await decrypt(session);

    if (!session || !payload) {
        console.log("Could not update session");
        return null;
    }

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const cookieStore = await cookies();
    cookieStore.set("session", session, {
        httpOnly: true,
        secure: true,
        expires: expires,
        sameSite: "lax",
        path: "/",
    });
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}

// write a function to try out decrypt and encrypt
export async function testEncryptDecrypt() {
    const token = {
        id: "123",
        email: "jaime",
        role: "admin",
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    };
    const session = await encrypt(token);
    console.log("encrypted", session);
    const payload = await decrypt(session);
    console.log("decrypted", payload);
}
