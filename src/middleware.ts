import { NextResponse, type NextRequest } from 'next/server';
import { supaMiddleware } from './utils/supabase/supaMiddleware';



export async function middleware(request: NextRequest) {

  const { supabase, response } = await supaMiddleware(request)
  const user = await supabase.auth.getUser()
  const session = await supabase.auth.getSession()
  let loggedIn: Boolean = false

  if (user?.data?.user?.email) {
    loggedIn = true
  }

  if (request.nextUrl.pathname === '/login' && loggedIn === true) {
    return NextResponse.rewrite(new URL("/", request.url))
  }

  if (request.nextUrl.pathname === '/signup' && loggedIn === true) {
    return NextResponse.rewrite(new URL("/", request.url))
  }


  return response
}

export const config = {
  matcher: ["/login", "/signup", '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',]
};
