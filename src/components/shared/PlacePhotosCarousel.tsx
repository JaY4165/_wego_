'use client';

import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';
import { Card, CardContent } from '../ui/card';
import { Photo } from './PlaceDetailsForDoalogBox';
import { getImageByReferenceId } from '@/app/actions/trip-plan-actions';
import Image from 'next/image';
import { string } from 'zod';

type Props = { photosData: Photo[] | [] };

export default function PlacePhotosCarousel({ photosData }: Props) {
  const [imgArr, setImgArr] = React.useState<any>([]);

  React.useEffect(() => {
    const fetchImage = async () => {
      if (photosData.length > 0) {
        const imageData = await getImageByReferenceId(photosData);
        setImgArr(imageData || []);
      }
    };

    fetchImage();
  }, [photosData]);

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {imgArr.map((photo: any) => {
          return (
            <CarouselItem
              key={crypto.randomUUID()}
              className=" md:basis-1/2 lg:basis-1/2 pl-1"
            >
              <div className="p-1">
                <Card>
                  <CardContent className="-ml-1  p-6">
                    <Image
                      src={photo || ''}
                      alt="Carousel Image"
                      width={900}
                      height={900}
                      className="w-full h-full aspect-square   object-contain"
                    />{' '}
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
            // <CarouselItem key={index} className="pt-1 md:basis-1/2">
            //   <div className="p-1">
            //     <Card>
            //       <CardContent className="flex items-center justify-center p-6">
            //         <Image
            //           src={photo || ''}
            //           alt="Carousel Image"
            //           width={100}
            //           height={100}
            //           className=""
            //         />
            //       </CardContent>
            //     </Card>
            //   </div>
            // </CarouselItem>
            // <CarouselItem key={index}>
            //   <div className="p-1">
            //     <Card>
            //       <CardContent className="flex aspect-square items-center justify-center p-6">
            //         <Image
            //           src={photo || ''}
            //           alt="Carousel Image"
            //           width={100}
            //           height={100}
            //           className=""
            //         />
            //       </CardContent>
            //     </Card>
            //   </div>
            // </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
