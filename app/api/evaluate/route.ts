import { NextRequest, NextResponse } from "next/server";
import { GROQ_API_URL, GROQ_MODEL, getGroQHeaders } from "@/config/api";
import {
  EVALUATION_SYSTEM_PROMPT,
  buildEvaluationPrompt,
} from "@/phase2-evaluation/evaluationPrompt";
import { EvaluationResult } from "@/types/evaluation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, user_prompt } = body;

    if (!content || !user_prompt) {
      return NextResponse.json(
        { error: "Missing content or user_prompt" },
        { status: 400 }
      );
    }

    const response = await fetch(GROK_API_URL, {
      method: "POST",
      headers: getGroqHeaders(),
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: "system",
            content: EVALUATION_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: buildEvaluationPrompt(user_prompt, content),
          },
        ],
        temperature: 0.2, // Low temperature for consistent structured output
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq evaluation error:", response.status, errorText);
      return NextResponse.json(
        { error: `Groq API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || "";

    // Parse JSON — strip any accidental markdown fences
    let evaluation: EvaluationResult;
    try {
      const cleaned = rawContent
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      evaluation = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Failed to parse evaluation JSON:", rawContent);
      return NextResponse.json(
        { error: "Failed to parse evaluation response" },
        { status: 500 }
      );
    }

    return NextResponse.json({ evaluation });
  } catch (error) {
    console.error("Evaluate route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
