"use server"

import { createSupabaseServerClient } from "@/utils/supabase/supaBaseServer";
import { unstable_noStore as noStore } from "next/cache";

export default async function readUser() {
    noStore()
    const supabase = createSupabaseServerClient();
    const user = await supabase.auth.getUser();
    const session = await supabase.auth.getSession();
    return { user, session };

}
