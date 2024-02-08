import React from 'react';
import Image from 'next/image';
import SignUpForm from '@/components/SignUpForm';

function SignUp() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-1 w-full py-10">
      <div className="w-full md:px-20 flex flex-col justify-center">
        <div className="pb-8 text-center">
          <h1 className="text-4xl pl-5 font-semibold">Welcome To WeGo ✨</h1>
          <p className="pt-2 text-sm font-light">
            Please enter your details to register with us.
          </p>
        </div>
        <SignUpForm />
      </div>
      <div className="overflow-hidden flex items-center justify-center rounded-2xl">
        <Image
          src="/images/OIG.jpeg"
          className="object-contain rounded-2xl backdrop-blur-lg  hidden md:block"
          width={600}
          height={400}
          loading="lazy"
          alt="Login image"
        />
      </div>
    </div>
  );
}

export default SignUp;
