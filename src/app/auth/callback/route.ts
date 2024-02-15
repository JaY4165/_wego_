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

  const supabase = createSupabaseServerClient()
  const user = await supabase.auth.getUser()

  // if (!user) {
  //   return NextResponse.redirect(requestUrl.origin + "/404")
  // }

  return NextResponse.redirect(requestUrl.origin + "/trip-planner")
}
