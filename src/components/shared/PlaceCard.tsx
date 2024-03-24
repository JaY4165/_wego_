import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PlaceDetailDialogBox from './PlaceDetailDialogBox';
import CardBadges from './CardBadges';

export default function PlaceCard({ place }: { place: any }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between">
          {place?.place_name}
          <Badge variant={'default'} className="max-h-5">
            ✨
          </Badge>
        </CardTitle>
        <CardDescription>{place?.address}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between dark:text-stone-400 text-black text-sm md:text-md ">
          <div className="space-y-2">
            <p>Rating: {place?.rating}</p>
            <p>Cost: {place?.cost_per_person}</p>
          </div>
          <div>
            <p>Timings: {place?.open_timings}</p>
            <div className="-ml-3 ">
              <PlaceDetailDialogBox placeId={place?.place_id} />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-primary">
        <CardBadges placesData={place} />
      </CardFooter>
    </Card>
  );
}
