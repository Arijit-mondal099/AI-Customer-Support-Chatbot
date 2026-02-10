import { BusinessModel } from "@/models/business.model";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt, ownerId } = (await request.json()) as {
      prompt: string;
      ownerId: string;
    };

    if (!prompt?.trim() || !ownerId?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: prompt and ownId.",
        },
        { status: 400 },
      );
    }

    const business = await BusinessModel.findOne({ $or: [{ ownerId }] });

    if (!business) {
      return NextResponse.json(
        {
          success: false,
          message: "Business not found for the provided ownerId.",
        },
        { status: 404 },
      );
    }

    const ai = new GoogleGenAI({ apiKey: business.apiKey });

    const LLM = ai.chats.create({
      model: "gemini-3-flash-preview",
      history: [],
      config: {
        systemInstruction: business.knowledge,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
      },
    });

    const res = await LLM.sendMessage({ message: prompt });

    return NextResponse.json(
      {
        success: true,
        data: { role: "model", text: res.text! },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing the request.",
        error,
      },
      { status: 500 },
    );
  }
}
