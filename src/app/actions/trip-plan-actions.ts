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



export async function controlCoord(address: string, place: any) {
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;

    try {
        const response = await axios.get(url);
        if (!response.data || response.status !== 200) {
            throw new Error(`Error fetching data: ${response.status}`);
        }


        const latitude = response.data.results[0].geometry.location.lat;
        const longitude = response.data.results[0].geometry.location.lng;


        console.log({ ...place, latitude, longitude });
        return { ...place, latitude, longitude };
    } catch (error) {
        console.error("Error updating place details:", error);
    }
}


export async function coordsControl(address: string): Promise<{ latitude: number, longitude: number } | undefined> {
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;

    try {
        const response = await axios.get(url);
        if (!response.data || response.status !== 200) {
            throw new Error(`Error fetching data: ${response.status}`);
        }

        const latitude = await response.data.results[0].geometry.location.lat;
        const longitude = await response.data.results[0].geometry.location.lng;

        return { latitude, longitude };
    }
    catch (error) {
        console.error("Error updating place details:", error);

    }
}