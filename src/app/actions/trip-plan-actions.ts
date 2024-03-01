"use server";

import { tripPlannerFormSchema } from "@/utils/validations/itirenaryValidations";
import { z } from "zod";
import generateIternary from "@/utils/gemini/gemini-ai-model";
import { purifyJson } from "@/utils/helpers";
import { Itinerary } from "@/stores/iternary-store";
import { v4 as uuidv4 } from 'uuid';
import prisma from "@/lib/db"
import readUser from '@/utils/supabase/readUser';



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
