"use strict";

import { tripPlannerFormSchema } from "@/utils/validations";
import { z } from "zod";

export async function planTrip(data: z.infer<typeof tripPlannerFormSchema>) {
    console.log(data);
    return "hello"
}
