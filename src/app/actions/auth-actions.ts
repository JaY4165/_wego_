'use server';

import { createSupabaseServerClient } from '@/utils/supabase/supaBaseServer';
import { signupFormSchema } from '@/utils/validations';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import z from 'zod';

export async function signUpWithEmailAndPassword(
    data: z.infer<typeof signupFormSchema>,
) {
    const supabase = createSupabaseServerClient();
    const result = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
    });

    return JSON.stringify(result);
}

export async function signInWithEmailAndPassword(data: {
    email: string;
    password: string;
}) {
    const supabase = createSupabaseServerClient();
    const result = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
    });

    return JSON.stringify(result);
}

export async function signOut() {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.auth.signOut();
    return JSON.stringify(error);
}


