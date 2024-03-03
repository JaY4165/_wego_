"use client"

import { Itinerary } from "@/stores/iternary-store";
import Geocode, { setKey } from 'react-geocode';



// setKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string);

export async function updateItineraryWithGeocoding(itinerary: Itinerary): Promise<Itinerary> {

    const updatedItinerary: any = {};

    for (const day in itinerary) {
        updatedItinerary[day] = itinerary[day].map(async (place) => {
            const { place_name, address } = place;
            const geocode = await Geocode.fromAddress(place_name + "," + address, process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string);
            const { lat, lng } = geocode.results[0].geometry.location;
            place.latitude = lat;
            place.longitude = lng;
            return {
                ...place,
            };
        });
    }

    return updatedItinerary as Itinerary;
}

