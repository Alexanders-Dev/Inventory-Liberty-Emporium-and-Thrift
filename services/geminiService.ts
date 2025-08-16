import { GoogleGenAI, Type } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";


// Ensure API key is available
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  // In a real app, you might show a more user-friendly error or disable functionality.
  // For this example, we throw an error during initialization.
  throw new Error("VITE_GEMINI_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// This interface defines the expected JSON structure from the AI model
export interface AnalyzedItem {
    itemName: string;
    description: string;
    estimatedPrice: string;
    category: string;
}

/**
 * Analyzes an image of an inventory item using the Gemini API.
 * @param imageAsBase64 The base64 encoded string of the image.
 * @param mimeType The MIME type of the image (e.g., 'image/jpeg').
 * @returns A promise that resolves to an object containing the item's name, description, and price.
 */
export const analyzeInventoryItem = async (imageAsBase64: string, mimeType: string): Promise<AnalyzedItem> => {
  const imagePart = {
    inlineData: {
      data: imageAsBase64,
      mimeType,
    },
  };

  const prompt = `You are an expert inventory valuator. Analyze the item in this image. Provide a concise item name, a detailed description, a realistic estimated price in USD, and a suitable category for the item (e.g., "Electronics", "Furniture", "Apparel"). Format the price with a dollar sign and two decimal places (e.g., "$123.45").`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, { text: prompt }] },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          itemName: { type: Type.STRING, description: 'A short, concise name for the item.' },
          description: { type: Type.STRING, description: 'A detailed description of the item, highlighting key features.' },
          estimatedPrice: { type: Type.STRING, description: 'An estimated market price in USD, formatted as a string (e.g., "$100.00").' },
          category: { type: Type.STRING, description: 'A single, relevant category for the item.' }
        },
        required: ["itemName", "description", "estimatedPrice", "category"]
      }
    }
  });

  const jsonText = response.text.trim();
  return JSON.parse(jsonText) as AnalyzedItem;
};
