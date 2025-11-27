import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "../constants";

// Initialize Gemini
// NOTE: In a real production app, ensure this key is restricted or proxied.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getProductRecommendation = async (userQuery: string, chatHistory: {role: string, parts: {text: string}[]}[] = []): Promise<string> => {
  try {
    const productContext = PRODUCTS.map(p => 
      `- ${p.name} (${p.category}): ₹${p.price}. ${p.description}`
    ).join('\n');

    const systemInstruction = `
      You are 'PantherBot', the AI sales assistant for the BLACKPANTHER store.
      
      Our Product Catalog:
      ${productContext}
      
      Goal: Help customers find products, compare prices, or check details.
      Tone: Sleek, professional, helpful, slightly mysterious/cool (like the Black Panther theme).
      Currency: INR (₹).
      
      Rules:
      1. Only recommend products from our catalog.
      2. Keep answers concise (under 50 words unless detail is requested).
      3. If asked about shipping/returns, say "We offer 7-day returns and free shipping on prepaid orders."
    `;

    // Convert chat history for the API
    // The SDK expects strict types, so we simplify for this helper
    // We will just use generateContent for single-turn or simple multi-turn simulation here
    // for simplicity in this demo structure, but `chat` is better for history.
    
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
      },
      history: chatHistory as any, // Casting for simplicity in this demo context
    });

    const result = await chat.sendMessage({
      message: userQuery
    });

    return result.text || "I'm having trouble connecting to the Vibranium network. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am currently offline. Please browse our catalog manually.";
  }
};
