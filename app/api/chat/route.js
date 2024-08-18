"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const generativeAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = generativeAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req) {
  const { prompt } = await req.json();

  try {
    const completion = await model.generateContent(prompt);
    const response = await completion.response;

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const text = response.text();
        controller.enqueue(encoder.encode(text));
        controller.close();
      },
    });

    return new Response(stream);
  } catch (error) {
    console.error("Error in AI response:", error);
    return new Response("Error generating response", { status: 500 });
  }
}

