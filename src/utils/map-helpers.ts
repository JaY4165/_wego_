import axios from "axios";


export async function updateLatLngs(itineraryData: any) {
    async function updatePlaceDetails(place: any) {
        console.log("workingggggggggggggggg")
        const address = place.address;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;

        try {
            const response = await axios.get(url);
            if (!response.data || response.status !== 200) {
                throw new Error(`Error fetching data: ${response.status}`);
            }

            console.log(response.data.results[0].geometry.location.lat, response.data.results[0].geometry.location.lng)
            // Extract latitude and longitude from the API response (replace with actual structure)
            const latitude = response.data.results[0].geometry.location.lat;
            const longitude = response.data.results[0].geometry.location.lng;



            return { ...place, latitude, longitude };
        } catch (error) {
            console.error("Error updating place details:", error);
            return place;
        }
    }

    for (const day in itineraryData.itinerary) {
        itineraryData.itinerary[day] = await Promise.all(
            itineraryData.itinerary[day].map(updatePlaceDetails)
        );
    }

    return itineraryData;
}
