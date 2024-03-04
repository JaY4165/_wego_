'use client';
import React, { useEffect } from 'react';
import {
  GoogleMap,
  Marker,
  LoadScriptNext,
  Libraries,
} from '@react-google-maps/api';
import { updateLatLngs } from '@/utils/map-helpers';
import { Prisma } from '@prisma/client';
import { updateItinerary } from '@/app/actions/trip-plan-actions';

export default function GoogleMapsView(props: {
  data: Prisma.JsonObject | any;
  isCorrected: boolean;
  id: string;
}): JSX.Element {
  const [coordinates, setCoordinates] = React.useState({
    lat: 0,
    lng: 0,
  });

  let zoom = 10;
  const libraries: Libraries = ['geocoding'];

  useEffect(() => {
    async function runWhenUpdatedIsFalse() {
      const res = await updateLatLngs(props.data);
      // console.log(res, 'this is the response');
      const resData = await updateItinerary(props.id, res);
      console.log(resData, 'this is working');
    }

    if (props.isCorrected === true) return;
    runWhenUpdatedIsFalse();
  }, [props.data, props.id, props.isCorrected]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(
        position.coords.latitude,
        position.coords.longitude,
        'this is the position',
      );
      setCoordinates({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  return (
    <>
      {/* <pre className="text-xl">
        {' '}
        page {res !== null ? JSON.stringify(res) : ''} */}
      {/* </pre> */}
      <LoadScriptNext
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
        libraries={libraries}
      >
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '90vh' }}
          zoom={zoom}
          center={coordinates}
        >
          <Marker position={coordinates} />
        </GoogleMap>
      </LoadScriptNext>
    </>
  );
}
