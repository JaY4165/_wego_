import React from 'react';
import { correctCoords, fetchItinerary } from '@/app/actions/trip-plan-actions';
import GoogleMapsV2 from '@/components/GoogleMapsV2';
import PlaceCardsContainer from '@/components/shared/PlaceCardsContainer';

export default async function TripPage({ params }: { params: { id: string } }) {
  const itinerary: any = (await fetchItinerary(params.id)) as any;
  const parsedItinerary = await JSON.parse(itinerary);
  const res = await correctCoords(params.id);
  let places = [];

  for (const x in await parsedItinerary) {
    for (const place of await parsedItinerary[x]) {
      places.push(place);
    }
  }

  return (
    <div className="w-full mb-14">
      {/* <GoogleMapsView
        data={itinerary as any}
        isCorrected={res}
        id={params.id}
      /> */}

      <GoogleMapsV2 data={itinerary as any} isCorrected={res} id={params.id} />

      <PlaceCardsContainer places={places} />
    </div>
  );
}
