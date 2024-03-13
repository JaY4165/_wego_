'use client';
import { getImagesForPlaceId } from '@/app/actions/trip-plan-actions';
import React from 'react';
import PlacePhotosCarousel from './PlacePhotosCarousel';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Badge } from '../ui/badge';

export interface PlaceData {
  formatted_address: string;
  geometry: Geometry;
  icon: string;
  name: string;
  photos: Photo[];
  rating: number;
  reviews: Review[];
  types: string[];
  url: string;
  user_ratings_total: number;
  website: string;
}

export interface Geometry {
  location: Location;
  viewport: Viewport;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Viewport {
  northeast: Location;
  southwest: Location;
}

export interface Photo {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
}

export interface Review {
  author_name: string;
  author_url: string;
  language: string;
  original_language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
  translated: boolean;
}

export default function PlaceDetailsForDialogBox({
  placeId,
}: {
  placeId: string | any;
}) {
  React.useEffect(() => {
    async function fetchPlaceData() {
      const data: PlaceData = (await getImagesForPlaceId(placeId)) as PlaceData;
      console.log(data, 'data' + placeId);
    }
    fetchPlaceData();
  }, [placeId]);

  return (
    <div className="">
      <PlacePhotosCarousel />

      <div className="pt-3 px-1">
        <h1 className="text-xl">Place Name</h1>
        <p className="mt-2 text-neutral-400">Address</p>
        <div className="mt-4">
          <div className="space-y-3 text-neutral-400">
            <p>Rating : </p>
            <p className="pb-5">Total User Ratings : </p>
            <Link href={'#'}>
              <Button variant={'default'}>Open In Google Maps </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="my-8">
        <h1 className="text-xl pt-3 px-1">Reviews</h1>
        <div className="px-1 mt-10">
          <div className="flex space-x-3">
            <div className="w-12 h-12 rounded-full bg-gray-200"></div>
            <div className="flex justify-between w-full">
              <div>
                <h1>Author Name</h1>
                <p className="text-neutral-400">Rating</p>
              </div>
              <div>
                <Badge variant={'secondary'}>4 days ago</Badge>
              </div>
            </div>
          </div>
          <div className="mt-5 text-neutral-400">
            <p className="text-justify">
              It’s a another peaceful beach in south Goa with a way through
              entering the Lalit resort and spa. It’s not a private beach and
              it’s allowed for everyone to go through the beach. There are
              couple of shacks there at the beach but little costly. Beach is
              beautiful and it’s not much crowded and it will be loved by the
              people who like peace.
            </p>
          </div>
        </div>
        <div className="px-1 mt-10">
          <div className="flex space-x-3">
            <div className="w-12 h-12 rounded-full bg-gray-200"></div>
            <div className="flex justify-between w-full">
              <div>
                <h1>Author Name</h1>
                <p className="text-neutral-400">Rating</p>
              </div>
              <div>
                <Badge variant={'secondary'}>4 days ago</Badge>
              </div>
            </div>
          </div>
          <div className="mt-5 text-neutral-400">
            <p className="text-justify">
              It’s a another peaceful beach in south Goa with a way through
              entering the Lalit resort and spa. It’s not a private beach and
              it’s allowed for everyone to go through the beach. There are
              couple of shacks there at the beach but little costly. Beach is
              beautiful and it’s not much crowded and it will be loved by the
              people who like peace.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
