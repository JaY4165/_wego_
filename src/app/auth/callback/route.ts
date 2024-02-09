import { createClient } from "@/utils/supabase/supaBaseServer";
import { NextResponse } from "next/server";

export async function GET(request: Request) {

  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  console.log("code", code);

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(requestUrl.origin);
}
