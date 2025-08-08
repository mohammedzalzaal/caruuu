
import { GoogleGenAI, Type } from "@google/genai";
import { Theme } from '../types';

// Ensure you have your API_KEY in the environment variables
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development if the key isn't set,
  // but in a real production environment, this should be handled properly.
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const themeSchema = {
  type: Type.OBJECT,
  properties: {
    skyColor: { type: Type.STRING, description: 'A hex color code for the sky or background.' },
    roadColor: { type: Type.STRING, description: 'A hex color code for the road surface.' },
    stripeColor: { type: Type.STRING, description: 'A hex color code for the dashed lines on the road.' },
    grassColor: { type: Type.STRING, description: 'A hex color code for the area beside the road.' },
    playerCarColor: { type: Type.STRING, description: 'A hex color code for the player\'s car.' },
    opponentCarColors: {
      type: Type.ARRAY,
      description: 'An array of exactly 3 hex color codes for opponent cars.',
      items: { type: Type.STRING }
    },
  },
  required: ['skyColor', 'roadColor', 'stripeColor', 'grassColor', 'playerCarColor', 'opponentCarColors']
};

/**
 * Generates a visual theme for the game using the Gemini API.
 * @param {string} promptText - The user's description of the desired theme.
 * @returns {Promise<Theme>} A promise that resolves to a Theme object.
 */
export const generateTheme = async (promptText: string): Promise<Theme> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a color theme for a retro racing game based on the following description: "${promptText}". Please provide hex color codes. The theme should be vibrant and have good contrast.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: themeSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedTheme = JSON.parse(jsonText);

    // Basic validation to ensure we have the right structure
    if (
      !parsedTheme.skyColor ||
      !parsedTheme.roadColor ||
      !Array.isArray(parsedTheme.opponentCarColors) ||
      parsedTheme.opponentCarColors.length < 3
    ) {
      throw new Error("AI response did not match the expected format.");
    }

    return parsedTheme;

  } catch (error) {
    console.error("Error generating theme with Gemini:", error);
    throw new Error("Failed to parse or retrieve theme from AI.");
  }
};
