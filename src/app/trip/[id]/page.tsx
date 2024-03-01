import React from 'react';
import { fetchItinerary } from '@/app/actions/trip-plan-actions';

export default async function TripPage({ params }: { params: { id: string } }) {
  const itinerary = await fetchItinerary(params.id);
  console.log(itinerary);
  return (
    <div>
      <pre className="text-xl"> page {JSON.stringify(itinerary)}</pre>
      {/* <p className="text-xl">{JSON.stringify(itinerary) || 'loading...'}</p> */}
    </div>
  );
}
