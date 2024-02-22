"use server";

import { tripPlannerFormSchema } from "@/utils/validations/itirenaryValidations";
import { z } from "zod";
import generateIternary from "@/utils/gemini/gemini-ai-model";
import { purifyJson } from "@/utils/helpers";
import { Itinerary } from "@/stores/iternary-store";
import { v4 as uuidv4 } from 'uuid';


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
