import { getURL } from '@/utils/getURL';
import { createSupabaseServerClient } from '@/utils/supabase/supaBaseServer';
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createSupabaseServerClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(getURL() + `/trip-planner?code?${code}`);
}