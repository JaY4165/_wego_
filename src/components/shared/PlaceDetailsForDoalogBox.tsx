'use client';
import { getImagesForPlaceId } from '@/app/actions/trip-plan-actions';
import React from 'react';
import PlacePhotosCarousel from './PlacePhotosCarousel';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { v4 as uuidv4 } from 'uuid';

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
  const [placeData, setPlaceData] = React.useState<PlaceData | null>(null);

  React.useEffect(() => {
    async function fetchPlaceData() {
      const data: PlaceData = (await getImagesForPlaceId(placeId)) as PlaceData;
      setPlaceData(data);
    }
    fetchPlaceData();
  }, [placeId]);

  return (
    <div className="">
      <PlacePhotosCarousel photosData={placeData?.photos || []} />

      <div className="pt-3 px-1">
        <h1 className="text-xl">{placeData?.name || ''}</h1>
        <p className="mt-2 text-neutral-400">
          {placeData?.formatted_address || ''}
        </p>
        <div className="mt-4">
          <div className="space-y-3 text-neutral-400">
            <p>Rating : {placeData?.rating?.toString() || '-'}</p>
            <p className="pb-5">
              Total User Ratings :{' '}
              {placeData?.user_ratings_total?.toString() || '-'}
            </p>
            <Link href={placeData?.url || '#'} target="_blank" passHref>
              <Button variant={'default'}>Open In Google Maps </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="my-8">
        <h1 className="text-xl pt-3 px-1">Reviews</h1>

        {placeData?.reviews?.map((review) => {
          return (
            <div className="px-1 mt-10" key={crypto.randomUUID()}>
              <div className="flex space-x-3">
                <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                <div className="flex justify-between w-full">
                  <div>
                    <h1>{review.author_name}</h1>
                    <p className="text-neutral-400">Rating : {review.rating}</p>
                  </div>
                  <div>
                    <Badge variant={'secondary'}>
                      {review.relative_time_description}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="mt-5 text-neutral-400">
                <p className="text-justify">{review.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
