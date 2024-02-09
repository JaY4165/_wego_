import { type NextRequest, NextResponse } from 'next/server';
import { updateSession, createClient } from '@/utils/supabase/supaMiddleware';

export async function middleware(request: NextRequest) {

  const { supabase } = createClient(request);
  const user = await supabase.auth.getUser()

  console.log("middleware running")


  if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup') && user) {
    return NextResponse.redirect('/');
  }


  return await updateSession(request);
}

export const config = {
  matcher: ['/login', '/signup', '/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)', '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
