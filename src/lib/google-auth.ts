import { OAuth2Client } from 'google-auth-library';
import { auth as firebaseAuth } from './firebase-admin';
import { ApiError } from './api-helpers';

// The frontend sends `idToken`. Depending on how the user signed in that is
// either a Firebase ID token (Firebase Google sign-in) or a raw Google OAuth ID
// token (Google Identity Services). We verify both, server-side, before trusting
// any of the claims.

export interface GoogleUserInfo {
  googleId: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
}

// Accept any of the configured client IDs as a valid audience.
const GOOGLE_CLIENT_IDS = [
  process.env.GOOGLE_CLIENT_ID,
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
].filter(Boolean) as string[];

function splitName(
  full: string | undefined,
  given: string | undefined,
  family: string | undefined,
  email: string | null,
): { firstName: string | null; lastName: string | null } {
  if (given || family) return { firstName: given ?? null, lastName: family ?? null };
  if (full) {
    const parts = full.trim().split(/\s+/);
    return { firstName: parts[0] ?? null, lastName: parts.slice(1).join(' ') || null };
  }
  return { firstName: email ? email.split('@')[0] : null, lastName: null };
}

/** Verify a Firebase ID token (preferred — the app already uses Firebase Admin). */
async function verifyFirebase(idToken: string): Promise<GoogleUserInfo | null> {
  if (!firebaseAuth) return null;
  try {
    const decoded = await firebaseAuth.verifyIdToken(idToken);
    const email = decoded.email ?? null;
    const { firstName, lastName } = splitName(
      decoded.name as string | undefined,
      (decoded as Record<string, unknown>).given_name as string | undefined,
      (decoded as Record<string, unknown>).family_name as string | undefined,
      email,
    );
    return {
      googleId: decoded.uid,
      email,
      firstName,
      lastName,
      profileImageUrl: (decoded.picture as string | undefined) ?? null,
    };
  } catch {
    return null;
  }
}

/** Verify a raw Google OAuth ID token against the configured client ID(s). */
async function verifyGoogle(idToken: string): Promise<GoogleUserInfo | null> {
  if (GOOGLE_CLIENT_IDS.length === 0) return null;
  try {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_IDS });
    const payload = ticket.getPayload();
    if (!payload?.sub) return null;
    const email = payload.email ?? null;
    const { firstName, lastName } = splitName(payload.name, payload.given_name, payload.family_name, email);
    return {
      googleId: payload.sub,
      email,
      firstName,
      lastName,
      profileImageUrl: payload.picture ?? null,
    };
  } catch {
    return null;
  }
}

export async function verifyGoogleToken(idToken: string): Promise<GoogleUserInfo> {
  if (!idToken) throw new ApiError(400, 'idToken is required');
  const info = (await verifyFirebase(idToken)) ?? (await verifyGoogle(idToken));
  if (!info) {
    throw new ApiError(401, 'Could not verify Google token. Configure FIREBASE_* or GOOGLE_CLIENT_ID.');
  }
  return info;
}
