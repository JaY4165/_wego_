import React from 'react';
import StateTripPlannerForm from '@/components/StateTripPlannerForm';

export default async function TripPlanner() {
  return (
    <div className="w-full flex items-center justify-center">
      <section className="py-20 w-full  md:w-[60%] lg:w-[60%] relative">
        <StateTripPlannerForm />
        <div className="absolute inset-0 m-auto h-[357px] blur-[118px] main-gradient2 -z-50"></div>
      </section>
    </div>
  );
}
