import { create } from 'zustand';

export interface Itinerary {
    id: string | any; // Use string for unique identifier consistency
    [day: string]: Place[]; // Index signature for dynamic day names
}

export interface Place {
    place_name: string;
    latitude: number;
    longitude: number;
    rating: number;
    open_timings: string;
    close_timings: string;
    cost_per_person: number;
    address: string;
}

export type ItineraryStoreState = {
    itinerary: Itinerary;
};

export type ItineraryStoreActions = {
    setItinerary: (itinerary: Itinerary) => void;
};

const useItineraryStore = create<ItineraryStoreState & ItineraryStoreActions>(
    (set) => ({
        itinerary: {
        } as Itinerary,
        setItinerary: (itinerary) => {
            set({ itinerary });
        },
    })
);

export default useItineraryStore;
