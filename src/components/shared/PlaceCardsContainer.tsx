import React from 'react';
import PlaceCard from './PlaceCard';
import { getPlaceIdForAddress } from '@/app/actions/trip-plan-actions';

export default async function PlaceCardsContainer({ places }: { places: any }) {
  const data = await getPlaceIdForAddress(places);
  return (
    <div className="grid grid-flow-row grid-cols-1 md:grid-cols-3 gap-4">
      {data.map((place: any) => {
        return <PlaceCard place={place} key={place.place_name} />;
      })}
    </div>
  );
}
