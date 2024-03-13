"use client"

import { coordsControl, createRoutes } from "@/app/actions/trip-plan-actions";
import { DirectionsService } from "@react-google-maps/api";

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



// export async function updateLatLngs(itineraryData: any) {
//     console.log(JSON.parse(itineraryData), 'itineraryData')
//     const data = typeof itineraryData === 'string' ? JSON.parse(itineraryData) : itineraryData;
//     let res: any = null;

//     async function updatePlaceDetails(place: any) {
//         const address = place.address;
//         res = controlCoord(address, place);
//         return res;
//     }


//     for (const day in data) {
//         data[day] = await Promise.all(
//             data[day].map(updatePlaceDetails)
//         );
//     }
//     return res;
// }





export async function updateLatsLongs(data: any[]) {
    let res: any[] = [];

    async function updatePlaceDetails(place: any) {
        const address = place.place_name + "," + place.address;
        const coords = await coordsControl(address);
        if (!coords) return;
        place.latitude = Number(coords?.latitude);
        place.longitude = Number(coords?.longitude);
        place.place_id = String(coords?.place_id)
        res.push(place);
    }

    for (const place of data) {
        await updatePlaceDetails(place);
    }

    console.log(res, 'res')

    return res;
}

const Waypoints = z.object({
    place_name: z.string(),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    rating: z.number(),
    open_timings: z.string(),
    close_timings: z.string(),
    cost_per_person: z.string(),
    address: z.string(),
})

export type Waypoints = z.infer<typeof Waypoints>

export async function createRoutesForData(data: Waypoints[]) {

    let wayPointsData = [];

    let originData = {
        ...data[0]
    }

    const finalCoordsPlace = data.length - 1;

    const waypoints = data.slice(1, finalCoordsPlace)

    for (const place of waypoints) {
        wayPointsData.push({
            lat: Number(place.latitude),
            lng: Number(place.longitude)
        })
    }

    console.log(wayPointsData, 'waypointsData1')

    let destinationData = {
        ...data[finalCoordsPlace]
    }
    // const res = await createRoutes(originData, destinationData, waypointsData)
    return { originData, destinationData, wayPointsData }
}



