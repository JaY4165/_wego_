import React from 'react';
import { correctCoords, fetchItinerary } from '@/app/actions/trip-plan-actions';
import GoogleMapsView from '@/components/GoogleMapsView';

export default async function TripPage({ params }: { params: { id: string } }) {
  const itinerary : any = await fetchItinerary(params.id) as any;
  const res = await correctCoords(params.id);

  return (
    <div>
      <GoogleMapsView
        data={itinerary as any}
        isCorrected={res}
        id={params.id}
      />
    </div>
  );
}
