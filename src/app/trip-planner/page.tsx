import React from 'react';
import TripPlannerForm from '@/components/TripPlannerForm';

export default async function TripPlanner() {
  return (
    <div className="w-full flex items-center justify-center">
      <section className="py-20 w-full  md:w-[60%] lg:w-[60%] relative">
        <TripPlannerForm />
        <div className="absolute inset-0 m-auto h-[357px] blur-[118px] main-gradient2 -z-50"></div>
      </section>
    </div>
  );
}
