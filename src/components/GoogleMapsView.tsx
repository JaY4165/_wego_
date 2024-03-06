'use client';
import React, { useEffect } from 'react';
import {
  GoogleMap,
  LoadScriptNext,
  Libraries,
  MarkerF,
  OverlayView,
  DirectionsRenderer,
  DirectionsService,
} from '@react-google-maps/api';
import { createRoutesForData, updateLatsLongs } from '@/utils/map-helpers';
import { fetchItinerary } from '@/app/actions/trip-plan-actions';

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
  const [userLocation, setUserLocation] = React.useState<any>({
    lat: 9.97779,
    lng: 76.274349,
  });
  const [directions, setDirections] = React.useState<any>(null);
  const mapRef = React.useRef(null);
  const [googleMap, setGoogleMap] = React.useState<any>(null);

  let zoom = 14;
  const libraries: Libraries = ['geocoding', 'routes'];

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     setUserLocation({
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
        if (res !== null) {
          setOriginalData(res);
        } else {
          setOriginalData([]);
        }
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

  useEffect(() => {
    try {
      createRoutesForData(originalData)
        .then((res) => {
          if (res !== null) {
            setDirections(res);
          } else {
            setDirections(null);
          }
        })
        .catch((err) => {
          console.log('cannot get routes data', 'err');
        });
    } catch (error) {
      console.log('error in creating routes data for map');
    }
  }, [originalData]);

  // useEffect(() => {
  //   console.log('directions', directions);
  // }, [directions]);

  const onLoad = React.useCallback((map: any) => {
    mapRef.current = map;
    setGoogleMap(map);
  }, []);

  return (
    <div className="mt-14 px-4 mb-14">
      {directions && (
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
            onLoad={onLoad}
          >
            {/* <MarkerF position={userLocation} /> */}

            {directions &&
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
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        </LoadScriptNext>
      )}
    </div>
  );
}
