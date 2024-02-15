import { createSupabaseServerClient } from '@/utils/supabase/supaBaseServer';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
      const supabase = createSupabaseServerClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {

        return NextResponse.redirect(`/error-page?error=${error}$status=500`, 500);
      }
      return NextResponse.redirect('/trip-planner');
    } else {

      return NextResponse.redirect(`/error?error${"Missing code parameter"}$status=400`, 400);
    }
  } catch (error) {

    return NextResponse.redirect(`/error?error${"Internal Server Error"}$status=500`, 500);
  }
}
