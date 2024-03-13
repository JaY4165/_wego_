// PlaceDetailDialogBox.tsx
'use client';

import React from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import PlaceDetailsForDialogBox from './PlaceDetailsForDoalogBox';
import { ArrowRightIcon } from 'lucide-react';

export default function PlaceDetailDialogBox({
  placeId,
}: {
  placeId: string | any;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  React.useEffect(() => {
    console.log(placeId);
  }, [placeId]);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="link">
            Know More <ArrowRightIcon className="size-6 pl-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full pt-14 h-[80vh] overflow-x-hidden overflow-y-scroll">
          <PlaceDetailsForDialogBox placeId={placeId} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="link">
          Know More <ArrowRightIcon className="size-6 pl-2" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className=" overflow-y-scroll overflow-x-hidden p-3">
        <DrawerHeader className="text-left">
          <DrawerTitle>Know More</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when done.
          </DrawerDescription>
        </DrawerHeader>
        <div className="">
          <PlaceDetailsForDialogBox placeId={placeId} />
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
