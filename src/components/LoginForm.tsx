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
import OAuthGoogleButton from './shared/OAuthGoogleButton';
import Link from 'next/link';

export default function LoginForm() {
  const passwordRef = useRef<HTMLInputElement>(null);
  const [showPwd, setShowPwd] = useState(false);
  const [isPending, startTransition] = useTransition();
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
          form.reset();
        } else {
          toast({
            title: 'Logged In Successfully',
            description: 'You have been logged in successfully',
            duration: 5000,
          });
          router.replace('/trip-planner');
        }
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
      <OAuthGoogleButton isPending={isPending} buttonType={'signin'} />
      <div className="pt-5 text-center">
        <p>
          Don&apos;t have an account ? &nbsp;
          <span className="">
            <Link href={'/signup'} className="underline">
              Signup for free
            </Link>
          </span>
        </p>
      </div>
    </>
  );
}
