import { loginFormSchema } from '@/utils/validations';
import { type NextRequest } from 'next/server';
import z from 'zod';
import { hashPassword } from '@/utils/bcryptHash';
import { createClient } from '@/utils/supabase/supaBaseServer';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const body: z.infer<typeof loginFormSchema> = await req.json();
    const parsedBody = loginFormSchema.safeParse(body);
    if (!parsedBody.success) {
      return new Response(JSON.stringify(parsedBody.error), {
        status: 500,
      });
    }
    const { email, password } = parsedBody.data;

    const userAlreadyPresent = await supabase.auth.getUser(email);

    if (userAlreadyPresent) {
      return new Response(JSON.stringify({ error: 'User already exists' }), {
        status: 400,
      });
    }

    const hashedPassword = await hashPassword(password);

    const { data, error } = await supabase.auth.signUp({
      email,
      password: hashedPassword,
    });

    if (error) {
      return new Response(JSON.stringify(error), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(data), {
      status: 201,
    });
  } catch (error: any) {
    return new Response(JSON.stringify(error), {
      status: 500,
    });
  }
}
