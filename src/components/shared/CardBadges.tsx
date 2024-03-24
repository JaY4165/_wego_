'use client';

import React from 'react';
import { Badge } from '../ui/badge';
import {
  getNearbyHospitals,
  getNearbyHotels,
  getNearbyRestaurants,
} from '@/app/actions/trip-plan-actions';
import useNearbyPlacesStore from '@/stores/nearby-places-store';

type Props = {
  placesData: any;
};

export default function CardBadges({ placesData }: Props) {
  const { nearbyPlaces, setNearbyPlaces }: any = useNearbyPlacesStore();

  async function handleHospitalclick() {
    setNearbyPlaces([]);
    const data = await getNearbyHospitals(
      placesData?.latitude,
      placesData?.longitude,
    );
    const formattedData = data.map((place: any) => {
      const name = place?.name;
      const latitude = place?.geometry?.location?.lat;
      const longitude = place?.geometry?.location?.lng;

      if (!name || !latitude || !longitude) {
        console.warn('Skipping place with missing data:', place);
        return null;
      }

      return [name, { lat: latitude, lng: longitude }];
    });

    setNearbyPlaces(formattedData);

    console.log('clicked', nearbyPlaces);
  }

  async function handleRestaurantclick() {
    setNearbyPlaces([]);
    const data = await getNearbyRestaurants(
      placesData?.latitude,
      placesData?.longitude,
    );
    const formattedData = data.map((place: any) => {
      const name = place?.name;
      const latitude = place?.geometry?.location?.lat;
      const longitude = place?.geometry?.location?.lng;

      if (!name || !latitude || !longitude) {
        console.warn('Skipping place with missing data:', place);
        return null;
      }

      return [name, { lat: latitude, lng: longitude }];
    });

    setNearbyPlaces(formattedData);

    console.log('clicked', nearbyPlaces);
  }

  async function handleHotelclick() {
    setNearbyPlaces([]);
    const data = await getNearbyHotels(
      placesData?.latitude,
      placesData?.longitude,
    );
    const formattedData = data.map((place: any) => {
      const name = place?.name;
      const latitude = place?.geometry?.location?.lat;
      const longitude = place?.geometry?.location?.lng;

      if (!name || !latitude || !longitude) {
        console.warn('Skipping place with missing data:', place);
        return null;
      }

      return [name, { lat: latitude, lng: longitude }];
    });

    setNearbyPlaces(formattedData);

    console.log('clicked', nearbyPlaces);
  }

  return (
    <div className="flex flex-col">
      <h1 className="pb-3">Near by :</h1>

      <div className="flex w-full space-x-4">
        <Badge
          variant={'outline'}
          className="cursor-pointer"
          onClick={handleHospitalclick}
        >
          Hospitals
        </Badge>
        <Badge
          variant={'outline'}
          className="cursor-pointer"
          onClick={handleRestaurantclick}
        >
          Restaurants
        </Badge>
        <Badge
          variant={'outline'}
          className="cursor-pointer"
          onClick={handleHotelclick}
        >
          Hotels
        </Badge>
      </div>
    </div>
  );
}
