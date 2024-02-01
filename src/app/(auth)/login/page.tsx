import React from 'react';
import Image from 'next/image';
import LoginForm from '@/components/LoginForm';

function LogIn() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-1 w-full py-10">
      <div className="w-full md:px-20 flex flex-col justify-center order-1">
        <div className="pb-8 text-center">
          <h1 className="text-4xl pl-5 font-semibold">Welcome Back ✨</h1>
          <p className="pt-2 text-sm font-light">
            Enter your email and password to access your account
          </p>
        </div>
        <LoginForm />
      </div>
      <div className="overflow-hidden flex items-center justify-center">
        <Image
          src="/images/OIG.jpeg"
          className="object-contain rounded-2xl backdrop-blur-lg blur-lg hidden md:block"
          width={600}
          height={400}
          loading="lazy"
          alt="Login image"
        />
      </div>
    </div>
  );
}

export default LogIn;
