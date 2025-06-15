import {GoogleGenAI} from '@google/genai';

export const AI = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_API_KEY
})