import React from 'react';
import { fetchItinerary } from '@/app/actions/trip-plan-actions';
import GoogleMapsView from '@/components/GoogleMapsView';
import { updateLatLngs } from '@/utils/map-helpers';

export default async function TripPage({ params }: { params: { id: string } }) {
  const itinerary = await fetchItinerary(params.id);
  const res = await updateLatLngs(itinerary);
  // console.log(res);
  return (
    <div>
      <pre className="text-xl"> page {JSON.stringify(res)}</pre>
      <pre className="text-xl"> page {JSON.stringify(itinerary)}</pre>
      {/* <p className="text-xl">{JSON.stringify(itinerary) || 'loading...'}</p> */}
      <GoogleMapsView data={res} />
    </div>
  );
}
