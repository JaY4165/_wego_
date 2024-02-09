'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from './ui/checkbox';
import { useEffect, useRef, useState, useTransition } from 'react';
import { loginFormSchema } from '@/utils/validations';
import { signInWithEmailAndPassword } from '@/app/actions/auth-actions';
import { useMutation } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const passwordRef = useRef<HTMLInputElement>(null);
  const [showPwd, setShowPwd] = useState(false);
  let [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginUser: any = async (data: z.infer<typeof loginFormSchema>) => {
    const res = await signInWithEmailAndPassword(data);
    return JSON.parse(res);
  };

  const mutation = useMutation({
    mutationFn: loginUser,
    onError(error) {
      console.log(error);
    },
    onSuccess(data) {
      return data;
    },
  });

  async function onSubmit(data: z.infer<typeof loginFormSchema | any>) {
    try {
      startTransition(async () => {
        const result: any = (await mutation.mutateAsync(data)) as any;

        if (result?.error) {
          toast({
            title: 'Error',
            description: result.error.message,
            duration: 5000,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Logged In Successfully',
            description: 'You have been logged in successfully',
            duration: 5000,
          });
          router.push('/');
        }
        form.reset();
      });
    } catch (error: any) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (showPwd === true) {
      passwordRef.current?.setAttribute('type', 'text');
    } else {
      passwordRef.current?.setAttribute('type', 'password');
    }
  }, [showPwd]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      className="bg-gray-100"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      className="bg-gray-100"
                      type="password"
                      {...field}
                      required
                      ref={passwordRef}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <div className="flex items-center space-x-2">
            <Checkbox id="showPwd" onClick={() => setShowPwd(!showPwd)} />
            <label
              htmlFor="showPwd"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Show Password
            </label>
          </div>
          <Button type="submit" className="w-full rounded-md">
            {isPending ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isPending ? 'Signing In' : 'Sign In'}
          </Button>
        </form>
      </Form>
      <div className="py-5 flex items-center text-md before:flex-[1_1_0%] before:border-t before:border-gray-400 before:me-6 after:flex-[1_1_0%] after:border-t after:border-gray-400 after:ms-6 dark:text-white dark:before:border-gray-600 dark:after:border-gray-600">
        or
      </div>
      <Button
        variant="outline"
        className="w-full"
        type="button"
        disabled={isPending}
      >
        {isPending ? (
          <Loader className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
            className="mr-2 h-4 w-4"
          >
            <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
          </svg>
        )}{' '}
        Sign in with Google
      </Button>
    </>
  );
}
