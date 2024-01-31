import React from 'react';
import Image from 'next/image';
import LoginForm from '@/components/LoginForm';

function LogIn() {
  return (
    <div className="grid grid-cols-2 grid-rows-1 w-full pt-5">
      <div className="w-full px-20">
        <div className="pt-3 pb-8 text-center">
          <h1 className="text-3xl">Welcome Back ✨</h1>
          <p className="">
            Enter your email and password to access your account
          </p>
        </div>
        <LoginForm />
      </div>
      <div className=" overflow-hidden flex items-center justify-center">
        <Image
          src="/images/OIG.jpeg"
          className="object-contain rounded-2xl"
          width={500}
          height={300}
          alt="Login image"
        />
      </div>
    </div>
  );
}

export default LogIn;
