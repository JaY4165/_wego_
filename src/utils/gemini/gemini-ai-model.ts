"use server"

import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";
import { tripPlannerFormSchema } from "../validations/itirenaryValidations";
import { z } from "zod";

const MODEL_NAME: string = process.env.GENERATIVE_MODEL_NAME as string;
const API_KEY: string = process.env.GEMINI_PRO_API_KEY as string;

export default async function generateIternary(data: z.infer<typeof tripPlannerFormSchema>) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
    };

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];




    const preText = `plan a itinerary with the best places in ${data.city}, ${data.state} , ${data.country}, and number of trip days should be strictly ${String(data.tripDays)}, and number of places to visit per day should be strictly ${String(data.placesPerDay)},  with the following details:\nformat of the output should be strictly based on the below shape :\n{\n  \"itinerary\": { \n   [day]: [\n      {\n        \"place_name\": \"string\",\n        \"latitude\": \"number\",\n        \"longitude\": \"number\",\n        \"rating\": \"number\",\n        \"open_timings\": \"string\",\n        \"close_timings\": \"string\",\n        \"cost_per_person\": \"number\"\n      }\n    ]\n  }\n}\nstrictly follow the above object format.\n`;

    const parts = [
        { text: String(preText) },
    ];


    const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
        safetySettings,
    });

    const response = result.response;
    return response.text();
}

