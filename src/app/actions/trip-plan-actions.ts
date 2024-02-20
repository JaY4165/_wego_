"use server";

import { tripPlannerFormSchema } from "@/utils/validations";
import { z } from "zod";
import generateIternary from "@/utils/gemini/gemini-ai-model";
import { redirect } from "next/navigation";

export async function planTrip(data: z.infer<typeof tripPlannerFormSchema>) {
    // const response = await generateIternary();
    // console.log(response, "response")
    // redirect("/trip-planner/trip?data=hello");
}
