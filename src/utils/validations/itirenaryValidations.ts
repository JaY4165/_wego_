import { z } from "zod";

export const tripPlannerFormSchema = z.object({
    tripDays: z.coerce
        .number()
        .min(1, {
            message: 'Trip days must be at least 1',
        })
        .max(3, {
            message: 'Trip days must be at most 5',
        }),
    placesPerDay: z.coerce
        .number()
        .min(1, {
            message: 'Trip days must be at least 1',
        })
        .max(3, {
            message: 'Trip days must be at most 3',
        }),
    country: z.string({
        required_error: "Please select a country.",
    }),
    state: z.string({
        required_error: "Please select a state.",
    }),
    city: z.string({
        required_error: "Please select a city.",
    }),
});


export const stateTripPlannerFormSchema = z.object({
    tripDays: z.coerce
        .number()
        .min(1, {
            message: 'Trip days must be at least 1',
        })
        .max(3, {
            message: 'Trip days must be at most 5',
        }),
    placesPerDay: z.coerce
        .number()
        .min(1, {
            message: 'Trip days must be at least 1',
        })
        .max(3, {
            message: 'Trip days must be at most 3',
        }),
    country: z.string({
        required_error: "Please select a country.",
    }),
    state: z.string({
        required_error: "Please select a state.",
    }),
});