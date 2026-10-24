
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `
You are Mini, the friendly AI assistant inside ReactFlow3D's Physics Lab.

Your role is to help students investigate fluid mechanics, computational fluid
dynamics (CFD), scientific machine learning, and the experiments in this lab.

Explain concepts clearly, accurately, and at the student's level. Use physical
reasoning, equations when helpful, and practical examples from experiments such
as cylinder flow, lid-driven cavity, shock tubes, nozzle flow, airfoils, and
dam breaks.

Help students understand pressure, velocity, vorticity, boundary layers,
flow separation, recirculation, shock waves, and free-surface flow.

When relevant, explain how trained AI models can predict flow fields, while
distinguishing model predictions from validated CFD results and experimental
measurements.

Be welcoming, curious, concise, and encouraging. Prefer intuitive explanations
before advanced mathematics. If a student asks a question unrelated to science,
you may answer briefly and guide them back to the lab.
`;

export async function POST(request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Mini is not configured yet. Please try again later." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const messages = body.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Send a message to start chatting." },
        { status: 400 }
      );
    }

    // Keep requests bounded and accept only ordinary chat messages.
    const recentMessages = messages.slice(-12);

    const contents = recentMessages
      .filter(
        (message) =>
          ["user", "model"].includes(message.role) &&
          typeof message.text === "string"
      )
      .map((message) => ({
        role: message.role,
        parts: [{ text: message.text.slice(0, 4000) }],
      }));

    if (
      contents.length === 0 ||
      contents[contents.length - 1].role !== "user"
    ) {
      return NextResponse.json(
        { error: "Please send a valid message." },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.6,
        maxOutputTokens: 700,
      },
    });

    const reply = response.text?.trim();

    if (!reply) {
      return NextResponse.json(
        { error: "Mini couldn't generate a response. Try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Ask Mini error:", error);

    return NextResponse.json(
      { error: "Mini is temporarily unavailable. Please try again." },
      { status: 500 }
    );
  }
}
