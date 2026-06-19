import { getUserSession } from "./getUserSession";

export interface Owner {
  ownerId: string;
  email: string;
}

type SessionShape = { user?: { id?: string; email?: string } } | null;

/**
 * Resolve the authenticated owner from the session cookie.
 * Returns null when there is no valid session — callers must 401.
 * The ownerId is always taken from the session, never from the request,
 * so every owner-scoped query is tenant-isolated.
 */
export const requireOwner = async (): Promise<Owner | null> => {
  const session = (await getUserSession()) as unknown as SessionShape;
  const ownerId = session?.user?.id;
  if (!ownerId) return null;
  return { ownerId, email: session?.user?.email ?? "" };
};
