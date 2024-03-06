import React from 'react';
import { PlaceCard } from './PlaceCard';

export default function PlaceCardsContainer({ places }: { places: any }) {
  return (
    <div className="grid grid-flow-row grid-cols-2 md:grid-cols-3 gap-4">
      {places.map((place: any) => {
        return <PlaceCard place={place} key={place.place_name} />;
      })}
    </div>
  );
}
