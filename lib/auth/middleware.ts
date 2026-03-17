import { NextRequest } from 'next/server';
import { verifyToken, type JWTPayload } from './jwt';
import { errorResponse } from '@/lib/utils/api-response';

/**
 * Get user from request (API routes)
 */
export async function getUserFromRequest(request: NextRequest): Promise<JWTPayload | null> {
  const token = request.cookies.get('auth_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Require authentication for API route
 */
export async function requireAuth(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return {
      user: null,
      error: errorResponse('Unauthorized - Please login', 401),
    };
  }
  return { user, error: null };
}

/**
 * Require admin role for API route
 */
export async function requireAdmin(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return { user: null, error };
  
  if (user!.role !== 'admin') {
    return {
      user: null,
      error: errorResponse('Forbidden - Admin access required', 403),
    };
  }
  return { user, error: null };
}
