"use client"

import axios from "axios";


export async function updateLatLngs(itineraryData: any) {

    let data = await JSON.parse(itineraryData);

    async function updatePlaceDetails(place: any) {

        const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string
        const address = place.address;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;

        try {
            const response = await axios.get(url);
            if (!response.data || response.status !== 200) {
                throw new Error(`Error fetching data: ${response.status}`);
            }

            const latitude = response.data.results[0].geometry.location.lat;
            const longitude = response.data.results[0].geometry.location.lng;
            return { ...place, latitude, longitude };
        } catch (error) {
            console.error("Error updating place details:", error);
        }
    }


    for (const day in data) {
        data[day] = await Promise.all(
            data[day].map(updatePlaceDetails)
        );
    }

    return data;
}
