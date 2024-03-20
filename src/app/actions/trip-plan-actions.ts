"use server";

import { tripPlannerFormSchema } from "@/utils/validations/itirenaryValidations";
import { z } from "zod";
import generateIternary from "@/utils/gemini/gemini-ai-model";
import { purifyJson } from "@/utils/helpers";
import { Itinerary } from "@/stores/iternary-store";
import { v4 as uuidv4 } from 'uuid';
import prisma from "@/lib/db"
import readUser from '@/utils/supabase/readUser';
import axios from "axios";
import generateIternaryPlan from "@/utils/gemini/gemini-ai-model-plan";



export async function planTrip(data: z.infer<typeof tripPlannerFormSchema>) {
    if (data.country === '' || data.state === '' || data.city === '') {
        return;
    }
    const response = await generateIternary(data);
    const purifiedResponse: Itinerary = await purifyJson(response) as Itinerary;
    const uid = uuidv4();
    purifiedResponse.id = uid;
    return purifiedResponse;
}


export async function storeItinerary(data: Itinerary) {
    const { user } = await readUser();
    await prisma?.itineraries.create({
        data: {
            itirenary_id: data.id,
            user_id: user?.data?.user?.id,
            itirenary_object: JSON.stringify(data?.itinerary),
        }
    });
}



export async function fetchItinerary(id: string) {
    const { user } = await readUser();
    const itinerary = await prisma?.itineraries.findFirst({
        where: {
            itirenary_id: id,
            user_id: user?.data?.user?.id,
        }
    });
    return itinerary?.itirenary_object;
}


export async function correctCoords(id: string) {
    const { user } = await readUser();
    const itinerary = await prisma?.itineraries.findFirst({
        where: {
            user_id: user?.data?.user?.id as string,
            itirenary_id: id
        },
        select: {
            coordinates_corrected: true
        }
    })

    if (itinerary?.coordinates_corrected === true) {
        return true;
    }

    return false;
}


export async function updateItinerary(id: string, data: any) {
    const { user } = await readUser();
    const res = await prisma?.itineraries.update({
        where: {
            user_id: user?.data?.user?.id as string,
            itirenary_id: id
        },
        data: {
            coordinates_corrected: true,
            itirenary_object: data
        },
        select: {
            itirenary_object: true
        }
    });
    return res;
}


// export async function fetchItinerary(id: string, data: any) {
//     const { user } = await readUser();
//     const res = await prisma?.itineraries.update({
//         where: {
//             user_id: user?.data?.user?.id as string,
//             itirenary_id: id
//         },
//         data: {
//             coordinates_corrected: true,
//             itirenary_object: data
//         },
//         select: {
//             itirenary_object: true
//         }
//     });
//     return res;
// }



// export async function controlCoord(address: string, place: any) {
//     const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string

//     const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;

//     try {
//         const response = await axios.get(url);
//         if (!response.data || response.status !== 200) {
//             throw new Error(`Error fetching data: ${response.status}`);
//         }


//         const latitude = response.data.results[0].geometry.location.lat;
//         const longitude = response.data.results[0].geometry.location.lng;


//         console.log({ ...place, latitude, longitude });
//         return { ...place, latitude, longitude };
//     } catch (error) {
//         console.error("Error updating place details:", error);
//     }
// }


export async function coordsControl(address: string): Promise<{ latitude: number, longitude: number, place_id: string } | undefined> {
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;


    try {
        const response = await axios.get(url);
        if (!response.data || response.status !== 200) {
            throw new Error(`Error fetching data: ${response.status}`);
        }



        const latitude = await response.data.results[0].geometry.location.lat;
        const longitude = await response.data.results[0].geometry.location.lng;
        const place_id = await response.data.results[0].place_id;

        return { latitude, longitude, place_id };
    }
    catch (error) {
        console.error("Error updating place details:", error);

    }
}

export async function getPlaceIdForAddress(places: any) {
    let placesWithPlaceId = [];
    for (const place of places) {
        const finalAddress = String(place.place_name + ',' + place.address);
        const data = await coordsControl(finalAddress);
        placesWithPlaceId.push({ ...place, place_id: data?.place_id });
    }

    return placesWithPlaceId;
}

export interface DataOfPlace {
    html_attributions: any[];
    result: Result;
    status: string;
}

export interface Result {
    formatted_address: string;
    geometry: Geometry;
    icon: string;
    name: string;
    photos?: Photo[];
    rating?: number;
    user_ratings_total: number;
    website?: string;
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



export async function getImagesForPlaceId(placeId: string) {
    console.log(placeId, 'placeId')
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,icon,rating,user_ratings_total,opening_hours,price_level,website,photos,type,url,current_opening_hours,opening_hours,formatted_phone_number,reviews,rating&key=${API_KEY}`;

    // console.log(url, 'url')

    try {
        const response = await axios.get(url);
        const res = response.data;
        if (!response.data || response.data === undefined || response.status !== 200) {
            throw new Error(`Error fetching data: ${response.status}`);
        }
        // console.log(placeId, response.data, 'placeId')
        return res.result;
    }
    catch (error) {
        console.error("Error getting place details:", error);
    }
}

export async function getImageByReferenceId(photosData: Photo[] | []) {

    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string
    // const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${referenceId}&key=${API_KEY}`

    try {

        let photoArray = photosData.map(async (photo) => {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&height=1000&photo_reference=${photo.photo_reference}&key=${API_KEY}`);
            if (!response.data || response.status !== 200) {
                throw new Error(`Error fetching data: ${response.status}`);
            }
            return response.request.res.responseUrl;
        });

        return Promise.all(photoArray
        ).then((data) => {
            return data;
        });

    }
    catch (error) {
        console.error("Error getting images:", error);
    }

}



export async function createRoutes(origin: any, destination: any, waypoints: any[]) {

    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string

    if (!origin || !destination || !waypoints) return;

    if (origin === null || destination === null || waypoints === null) return;


    console.log(origin, destination, waypoints, 'origin, destination, waypoints')

    const url = new URL('https://maps.googleapis.com/maps/api/directions/json');
    url.searchParams.append('travelMode', 'driving');
    url.searchParams.append('origin', `${origin.address}`);
    // url.searchParams.append(
    //     'waypoints',
    //     waypoints.map((waypoint: any) => `via:${waypoint.latitude},${waypoint.longitude}`).join('|')
    // );
    url.searchParams.append('destination', `${destination.address}`);
    url.searchParams.append('key', API_KEY as string);

    const response = await axios.get(String(url));

    console.log(String(url))

    if (!response.data || response.status !== 200) {
        throw new Error(`Error fetching data: ${response.status}`);
    } else {
        return response.data;
    }
}


export async function getItineraryPlan(plan: any) {
    const data = await generateIternaryPlan(plan);
    return data
}