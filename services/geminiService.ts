
import { GoogleGenAI, Type } from "@google/genai";

export interface ScannedReceiptData {
  merchantName: string;
  totalAmount: number;
  transactionDate: string;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const scanReceipt = async (
  imageBase64: string,
  mimeType: string
): Promise<ScannedReceiptData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType,
            },
          },
          {
            text: "Extract the merchant name, total amount, and transaction date from this receipt. The date should be in YYYY-MM-DD format.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            merchantName: {
              type: Type.STRING,
              description: "The name of the merchant or store.",
            },
            totalAmount: {
              type: Type.NUMBER,
              description: "The final total amount of the transaction.",
            },
            transactionDate: {
              type: Type.STRING,
              description: "The date of the transaction in YYYY-MM-DD format.",
            },
          },
          required: ["merchantName", "totalAmount", "transactionDate"],
        },
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);

    // Basic validation
    if (
      !parsedData.merchantName ||
      typeof parsedData.totalAmount !== 'number' ||
      !parsedData.transactionDate
    ) {
      throw new Error('Invalid data format received from API.');
    }

    return parsedData;
  } catch (error) {
    console.error("Error scanning receipt with Gemini:", error);
    throw new Error("Failed to analyze the receipt. Please try again or enter details manually.");
  }
};
