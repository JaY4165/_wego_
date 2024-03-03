'use client';
import React, { useEffect } from 'react';
import {
  GoogleMap,
  Marker,
  LoadScriptNext,
  Libraries,
} from '@react-google-maps/api';
import { updateLatLngs } from '@/utils/map-helpers';

export default function GoogleMapsView(data: any) {
  async function ruu() {
    const res = await updateLatLngs(data);
    console.log(res, 'this is working');
  }

  useEffect(() => {
    ruu();
  }, [data]);

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
