import { NextResponse, type NextRequest } from 'next/server';
import { supaMiddleware } from './utils/supabase/supaMiddleware';
import { UserResponse } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  const { supabase, response } = await supaMiddleware(request);
  const user: UserResponse = await supabase.auth.getUser();
  let loggedIn: Boolean = false;

  if (user?.error) {

  }

  if (user?.data?.user?.email) {
    loggedIn = true;
  }

  if (request.nextUrl.pathname === '/login' && loggedIn === true) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (request.nextUrl.pathname === '/signup' && loggedIn === true) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (request.nextUrl.pathname === '/trip-planner' && loggedIn === false) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}


export const config = {
  matcher: [
    '/login',
    '/signup',
    '/trip-planner',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
