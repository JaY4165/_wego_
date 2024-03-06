'use client';
import React, { useEffect } from 'react';

import { createRoutesForData, updateLatsLongs } from '@/utils/map-helpers';
import { fetchItinerary } from '@/app/actions/trip-plan-actions';
import {
  APIProvider,
  Map,
  Marker,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';

export default function GoogleMapsV2(props: {
  data: any;
  isCorrected: boolean;
  id: string;
}): JSX.Element {
  // console.log(JSON.parse(props.data), 'props.data');

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

  //   const onLoad = React.useCallback((map: any) => {
  //     mapRef.current = map;
  //     setGoogleMap(map);
  //   }, []);

  return (
    <div className="mt-14 mb-14 h-[90vh] w-full">
      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
      >
        <Map defaultCenter={center} defaultZoom={15}>
          {/* <Marker position={center} /> */}
          <Directions data={directions} />
        </Map>
      </APIProvider>
    </div>
  );
}

function Directions(data: any) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const gecodeLib = useMapsLibrary('geocoding');
  const [directionsService, setDirectionsService] =
    React.useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] =
    React.useState<google.maps.DirectionsRenderer | null>(null);
  const [routes, setRoutes] = React.useState<any>(null);
  const [geoCodeService, setGeoCodeService] =
    React.useState<google.maps.Geocoder | null>(null);
  const [origin, setOrigin] = React.useState<string>('');
  const [destination, setDestination] = React.useState<string>('');
  const [waypoints, setWaypoints] = React.useState<
    google.maps.DirectionsWaypoint[] | []
  >([]);

  async function reverseGeocode(
    geocodeService: google.maps.Geocoder,
    waypoint: any,
  ): Promise<{ location: string }> {
    const waypointLatLang = {
      lat: waypoint.lat,
      lng: waypoint.lng,
    };

    try {
      const res = await geocodeService.geocode({ location: waypointLatLang });
      return { location: res.results[0].formatted_address };
    } catch (error) {
      console.log(error);
      return { location: '' };
    }
  }

  useEffect(() => {
    if (!routesLib || !map || !gecodeLib) {
      return;
    }
    setDirectionsService(new routesLib.DirectionsService());
    setDirectionsRenderer(new routesLib.DirectionsRenderer({ map }));
    setGeoCodeService(new gecodeLib.Geocoder());
  }, [routesLib, map, gecodeLib]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) {
      return;
    }

    if (origin !== '' && destination !== '') {
      directionsService
        .route({
          origin: origin,
          destination: destination,
          waypoints: waypoints,
          travelMode: google.maps.TravelMode.DRIVING,
        })
        .then((response: any) => {
          directionsRenderer.setDirections(response);
          setRoutes(response.routes);
        });
    }
  }, [destination, directionsRenderer, directionsService, origin, waypoints]);

  useEffect(() => {
    const originLatLang = {
      lat: Number(data.data.originData.latitude),
      lng: Number(data.data.originData.longitude),
    };

    const destinationLatLang = {
      lat: Number(data.data.destinationData.latitude),
      lng: Number(data.data.destinationData.longitude),
    };

    if (
      geoCodeService &&
      !Number.isNaN(originLatLang.lat) &&
      !Number.isNaN(originLatLang.lng) &&
      !Number.isNaN(destinationLatLang.lat) &&
      !Number.isNaN(destinationLatLang.lng)
    ) {
      geoCodeService
        .geocode({ location: originLatLang })
        .then((res: any) => {
          setOrigin(String(res.results[0].formatted_address));
        })
        .catch((error: any) => {
          console.log(error);
        });

      geoCodeService
        .geocode({ location: destinationLatLang })
        .then((res: any) => {
          setDestination(String(res.results[0].formatted_address));
        })
        .catch((error: any) => {
          console.log(error);
        });

      const waypointsPromises = data.data.wayPointsData.map((waypoint: any) =>
        reverseGeocode(geoCodeService, waypoint),
      );

      const waypointsAddresses = Promise.all(waypointsPromises);

      waypointsAddresses.then((res) => {
        setWaypoints(res);
      });
    }
  }, [data, geoCodeService]);

  return null;
}
