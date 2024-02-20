"use server"

import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME: string = process.env.GENERATIVE_MODEL_NAME as string;
const API_KEY: string = process.env.GEMINI_PRO_API_KEY as string;

export default async function generateIternary() {
    console.log(MODEL_NAME, API_KEY, "this is api")
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

    const parts = [
        { text: "plan a itinerary with the best places in Whitefield, Bengaluru, Karnataka, with the following details:\nformat of the output should be strictly based on the below shape :\n{\n[{\nplace name ,\nlatitude,\nlongitude,\nrating,\nopen and close timings,\ncost per person,\n}]\n}\nstrictly follow the above object format." },
    ];


    const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
        safetySettings,
    });

    const response = result.response;
    return response.text();
}

