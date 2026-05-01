import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "No image data provided" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API Key is not configured" }, { status: 500 });
    }

    // Initialize the model (Gemini 1.5 Flash is recommended for speed and vision)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a specialized financial receipt scanner. 
      Analyze the attached receipt image and extract exactly these fields in JSON format:
      1. total: the total amount spent (as a number, without currency symbols).
      2. merchant: the name of the store or merchant.
      3. category: one of these specific values: "Food", "Transport", "Shopping", "Bill", "Health", "Other".
      4. description: a short summary of what was bought.
      
      Only return the JSON object, nothing else.
    `;

    // Remove the data:image/jpeg;base64, prefix if present
    const base64Content = imageBase64.split(",")[1] || imageBase64;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Content,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Clean up response if AI included markdown blocks
    const cleanedJson = text.replace(/```json|```/g, "").trim();
    const parsedData = JSON.parse(cleanedJson);

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("AI Receipt Scan Error:", error);
    return NextResponse.json({ error: "Failed to analyze receipt. Please try manual entry." }, { status: 500 });
  }
}
