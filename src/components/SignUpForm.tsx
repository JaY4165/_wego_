'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
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
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function SignUpForm() {
  const router = useRouter();
  const passwordRef1 = useRef<HTMLInputElement>(null);
  const passwordRef2 = useRef<HTMLInputElement>(null);
  const [showPwd, setShowPwd] = useState(false);

  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const registerUser: any = async (data: z.infer<typeof signupFormSchema>) => {
    const response = await axios.post('/api/register', {
      email: data.email,
      password: data.password,
    });
    if (!response?.data) console.log('Server error');
    if (response.status === 400) console.log('User Already Exists');
    if (response.status === 500) console.log('Server error');
    console.log(response.data);
    return response.data;
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

  async function onSubmit(values: z.infer<typeof signupFormSchema | any>) {
    try {
      const submittedData = await mutation.mutateAsync(values);
      console.log(submittedData, 'submittedData');
      if ((submittedData as { session?: any })?.session) router.push('/login');
    } catch (error: any) {
      console.error(error);
    }
  }

  const isLoading = false;

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
            {isLoading ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isLoading ? 'Signing Up' : 'Sign Up'}
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
        disabled={isLoading}
      >
        {isLoading ? (
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
        Sign Up with Google
      </Button>
    </>
  );
}
