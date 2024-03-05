"use client"

import { controlCoord, coordsControl } from "@/app/actions/trip-plan-actions";

import { z } from 'zod';

const placeSchema = z.object({
    place_name: z.string(),
    latitude: z.number().finite(),
    longitude: z.number().finite(),
    rating: z.number().positive(),
    open_timings: z.string().optional(),
    close_timings: z.string().optional(),
    cost_per_person: z.number().positive(),
    address: z.string(),
});

const dayKeySchema = z.string().min(1);

type DaySchema = z.infer<typeof daySchema>;

const daySchema = z.array(placeSchema);

const itinerarySchema = z.record(dayKeySchema, daySchema);

export default itinerarySchema;



export async function updateLatLngs(itineraryData: any) {
    console.log(JSON.parse(itineraryData), 'itineraryData')
    const data = typeof itineraryData === 'string' ? JSON.parse(itineraryData) : itineraryData;
    let res: any = null;

    async function updatePlaceDetails(place: any) {
        const address = place.address;
        res = controlCoord(address, place);
        return res;
    }


    for (const day in data) {
        data[day] = await Promise.all(
            data[day].map(updatePlaceDetails)
        );
    }
    return res;
}



export async function updateLatsLongs(data: any[]) {
    let res: any[] = [];

    async function updatePlaceDetails(place: any) {
        const address = place.place_name + "," + place.address;
        const coords = await coordsControl(address);
        if (!coords) return;
        place.latitude = Number(coords?.latitude);
        place.longitude = Number(coords?.longitude);
        res.push(place);
    }

    for (const place of data) {
        await updatePlaceDetails(place);
    }

    return res;
}