import React from 'react';
import TripPlannerForm from '@/components/TripPlannerForm';
import Link from 'next/link';

export default async function TripPlanner() {
  return (
    <>
      <div className="w-full flex items-center justify-center">
        <section className="py-20 w-full  md:w-[60%] lg:w-[60%] relative">
          <TripPlannerForm />
          <div className="absolute inset-0 m-auto h-[357px] blur-[118px] main-gradient2 -z-50"></div>
        </section>
      </div>
      <section className="pb-10 text-center">
        <Link
          href={'/state-trip-planner'}
          className="dark:text-white text-black text-xl  underline underline-offset-8"
        >
          Plan Trip For State
        </Link>
      </section>
    </>
  );
}
