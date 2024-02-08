import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/supaMiddleware';

export async function middleware(request: NextRequest) {
  try {
    const { supabase, response } = createClient(request);
    await supabase.auth.getUser();
    return response;
  } catch (e: any) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
