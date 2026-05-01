import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Mock response if no API key is provided
      console.warn("GEMINI_API_KEY not found. Returning mock AI response.");
      return NextResponse.json({
        amount: 45000,
        category: 'Food',
        description: 'Mock Struk Kopi'
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    const prompt = "Extract the total amount, merchant name, and primary category from this receipt. Return ONLY a valid JSON object with keys: amount (number), category (string), description (string). If category is unclear, use 'General'.";

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: file.type
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Clean up the response text in case Gemini wraps it in ```json ... ```
    const jsonStr = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(jsonStr);

    return NextResponse.json(data);
  } catch (err) {
    console.error('Gemini Vision Error:', err);
    return NextResponse.json({ error: 'Failed to parse receipt' }, { status: 500 });
  }
}
