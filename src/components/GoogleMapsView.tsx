'use client';
import React from 'react';
import {
  GoogleMap,
  Marker,
  LoadScriptNext,
  Libraries,
} from '@react-google-maps/api';
import { updateItineraryWithGeocoding } from '@/utils/map-helpers';

export default function GoogleMapsView(data: any) {
  // const obj = updateItineraryWithGeocoding(data);

  let lat = 12.977848533593487;
  let lng = 77.63785319619643;
  let zoom = 10;
  const libraries: Libraries = ['geocoding']; // Optional libraries for specific functionalities

  return (
    <LoadScriptNext
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
      libraries={libraries}
    >
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '90vh' }}
        zoom={zoom}
        center={{ lat, lng }}
      >
        <Marker position={{ lat, lng }} />
      </GoogleMap>
    </LoadScriptNext>
  );
}
