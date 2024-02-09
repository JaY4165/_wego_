import { loginFormSchema } from '@/utils/validations';
import { type NextRequest } from 'next/server';
import z, { any } from 'zod';
import { hashPassword } from '@/utils/bcryptHash';
import { createClient } from '@/utils/supabase/supaBaseServer';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const body: z.infer<typeof loginFormSchema> = await req.json();
    const parsedBody = loginFormSchema.safeParse(body);
    if (!parsedBody.success) {
      return new Response(JSON.stringify(parsedBody.error), {
        status: 400,
      });
    }
    const { email, password } = parsedBody.data;

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
