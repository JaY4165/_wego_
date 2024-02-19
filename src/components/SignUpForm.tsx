'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState, useTransition } from 'react';
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
import { signupFormSchema } from '@/utils/validations';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { signUpWithEmailAndPassword } from '@/app/actions/auth-actions';
import { toast } from '@/components/ui/use-toast';
import OAuthGoogleButton from './shared/OAuthGoogleButton';
import Link from 'next/link';

export default function SignUpForm() {
  const router = useRouter();
  const passwordRef1 = useRef<HTMLInputElement>(null);
  const passwordRef2 = useRef<HTMLInputElement>(null);
  const [showPwd, setShowPwd] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const registerUser: any = async (data: z.infer<typeof signupFormSchema>) => {
    const res = await signUpWithEmailAndPassword(data);
    return JSON.parse(res);
  };

  const mutation = useMutation({
    mutationFn: registerUser,
    onError(error) {
      console.log(error);
    },
    onSuccess(data) {
      return data;
    },
  });

  async function onSubmit(data: z.infer<typeof signupFormSchema | any>) {
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
            title: 'Account Created',
            description: 'Your account has been created successfully.',
            duration: 5000,
          });
          router.replace('/trip-planner');
        }
        form.reset();
      });
    } catch (error: any) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (showPwd === true) {
      passwordRef1.current?.setAttribute('type', 'text');
      passwordRef2.current?.setAttribute('type', 'text');
    } else {
      passwordRef1.current?.setAttribute('type', 'password');
      passwordRef2.current?.setAttribute('type', 'password');
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
                      ref={passwordRef1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter confirm password"
                      className="bg-gray-100"
                      type="password"
                      {...field}
                      ref={passwordRef2}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <div className="flex items-center space-x-2">
            <Checkbox id="showPassword" onClick={() => setShowPwd(!showPwd)} />
            <label
              htmlFor="showPassword"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Show Password
            </label>
          </div>
          <Button type="submit" className="w-full rounded-md">
            {isPending ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isPending ? 'Signing Up' : 'Sign Up'}
          </Button>
        </form>
      </Form>
      <div className="py-5 flex items-center text-md before:flex-[1_1_0%] before:border-t before:border-gray-400 before:me-6 after:flex-[1_1_0%] after:border-t after:border-gray-400 after:ms-6 dark:text-white dark:before:border-gray-600 dark:after:border-gray-600">
        or
      </div>
      <OAuthGoogleButton isPending={isPending} buttonType={'signup'} />
      <div className="pt-5 text-center">
        <p>
          Already have an account ? &nbsp;
          <span className="">
            <Link href={'/login'} className="underline">
              Log In
            </Link>
          </span>
        </p>
      </div>
    </>
  );
}
