import { create } from "zustand";


export interface NearbyPlacesData {
    nearbyPlaces: [string, { lat: number; lng: number }][] | [];
}




const useNearbyPlacesStore = create<NearbyPlacesData>(
    (set) => ({
        nearbyPlaces: [],
        setNearbyPlaces: (nearbyPlaces: [string, { lat: number; lng: number }][]) =>
            set({ nearbyPlaces }),
    })
);

export default useNearbyPlacesStore;
