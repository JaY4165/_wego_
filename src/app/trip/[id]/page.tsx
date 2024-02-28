// import useItineraryStore from '@/stores/iternary-store';
import React from 'react';

export default async function TripPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-3xl"> page {params.id}</h1>
      {/* <p className="text-xl">{JSON.stringify(itinerary) || 'loading...'}</p> */}
    </div>
  );
}
