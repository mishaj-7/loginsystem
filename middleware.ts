// middleware.ts (in root directory)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get token from header
  const token = request.headers.get('authorization');

  // Check if the route requires authentication
  if (request.nextUrl.pathname.startsWith('/api/logs')) {
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/logs/:path*']
};
