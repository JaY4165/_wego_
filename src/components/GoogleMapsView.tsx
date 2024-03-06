'use client';
import React, { useEffect } from 'react';
import {
  GoogleMap,
  Marker,
  LoadScriptNext,
  Libraries,
  MarkerF,
  OverlayView,
} from '@react-google-maps/api';
import { updateLatLngs, updateLatsLongs } from '@/utils/map-helpers';
import { Prisma } from '@prisma/client';
import {
  fetchItinerary,
  updateItinerary,
} from '@/app/actions/trip-plan-actions';

export default function GoogleMapsView(props: {
  data: any;
  isCorrected: boolean;
  id: string;
}): JSX.Element {
  const [places, setPlaces] = React.useState<any>(null);
  const [center, setCenter] = React.useState<{ lat: number; lng: number }>({
    lat: 9.97779,
    lng: 76.274349,
  });
  const [markerData, setMarkerData] = React.useState<any[]>([]);
  const [originalData, setOriginalData] = React.useState<any[]>([]);

  let zoom = 14;
  const libraries: Libraries = ['geocoding'];

  // useEffect(() => {
  //   // async function runWhenUpdatedIsFalse() {
  //   //   const parsedData = await props.data;
  //   //   // console.log(parsedData, 'parsedDatawhen false');
  //   //   const res = await updateLatLngs(parsedData);
  //   //   const resData = await updateItinerary(props.id, res);
  //   //   // console.log(resData, 'fetched when false');
  //   //   setPlaces(resData);
  //   // }

  //   // async function runWhenUpdatedIsTrue() {
  //   //   const fetchedDataWhenTrue = await fetchItinerary(props.id);
  //   //   // console.log(fetchedDataWhenTrue, 'fetched when true');
  //   //   setPlaces(fetchedDataWhenTrue);
  //   // }

  //   // if (props.isCorrected !== true) {
  //   //   runWhenUpdatedIsFalse();
  //   // } else {
  //   //   runWhenUpdatedIsTrue();
  //   // }
  // }, [props.data, props.id, props.isCorrected]);

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     setCenter({
  //       lat: position.coords.latitude,
  //       lng: position.coords.longitude,
  //     });
  //   });
  // }, []);

  useEffect(() => {
    async function runWhenUpdatedIsTrue() {
      const fetchedDataWhenTrue: any = (await fetchItinerary(props.id)) as any;
      const parsedRes = await JSON.parse(fetchedDataWhenTrue);
      // console.log(parsedRes, 'fetched when true');
      setPlaces(parsedRes);
    }
    try {
      runWhenUpdatedIsTrue();
      // console.log(JSON.parse(places), 'places');
    } catch (error) {
      console.log(error);
    }
  }, [props.id]);

  useEffect(() => {
    let marks: any[] = [];

    for (const day in places) {
      for (const place of places[day]) {
        marks.push(place);
      }
    }
    setMarkerData(marks);

    // console.log(markerData, 'markerData');
  }, [places]);

  useEffect(() => {
    updateLatsLongs(markerData)
      .then((res) => {
        // console.log(res, 'res');
        setOriginalData(res);
      })
      .catch((err) => {
        console.log(err, 'err');
      });
  }, [markerData]);

  useEffect(() => {
    const lat = parseFloat(originalData[0]?.latitude);
    const lng = parseFloat(originalData[0]?.longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      setCenter({
        lat: lat,
        lng: lng,
      });
    }
    // console.log(center, 'center');
  }, [originalData]);

  return (
    <div className="mt-14 px-4 mb-14">
      {originalData && (
        <LoadScriptNext
          googleMapsApiKey={
            process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string
          }
          libraries={libraries}
        >
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '90vh' }}
            zoom={zoom}
            center={center}
          >
            {originalData &&
              markerData.map((marker, index) => (
                <MarkerF
                  key={index}
                  position={{
                    lat: Number(marker.latitude),
                    lng: Number(marker.longitude),
                  }}
                >
                  <OverlayView
                    position={{
                      lat: Number(marker.latitude),
                      lng: Number(marker.longitude),
                    }}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  >
                    <h1 className="text-sm text-black">{marker.place_name}</h1>
                  </OverlayView>
                </MarkerF>
              ))}
          </GoogleMap>
        </LoadScriptNext>
      )}
    </div>
  );
}
