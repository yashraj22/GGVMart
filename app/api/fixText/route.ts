import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: any, res: NextResponse) {
  try {
    const { prompt } = await req.json(); // Extract the prompt from the request body
    // const prompt = "ii amm a sbudent."
    // console.log(res.body)
    console.log(prompt);
    const enhancedPrompt =
      prompt +
      " Enhance this sentence in more descriptive way, keep it in one line and keep the languge very simple dont use fancy words."; // Enhance the prompt
    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    const response = await axios.post(
      apiUrl,
      {
        contents: [
          {
            parts: [{ text: enhancedPrompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.data;
    console.log(data); // Log the response data from the API
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.error();
  }
}
