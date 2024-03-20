import { getItineraryPlan } from '@/app/actions/trip-plan-actions';
import React from 'react';
import { Card } from '../ui/card';

export default async function ItineraryPlan(itinerary: any) {
  const strIt = JSON.stringify(itinerary.itinerary);
  const data = await getItineraryPlan(strIt);

  return (
    <div className="w-full">
      <h1 className="text-3xl text-center font-bold mt-20 mb-10">
        {'Itinerary Plan'}
      </h1>
      <div>
        <Card className="p-10">
          <pre className="text-xl text-pretty">
            {data !== undefined ? data : ''}
          </pre>
        </Card>
      </div>
    </div>
  );
}
