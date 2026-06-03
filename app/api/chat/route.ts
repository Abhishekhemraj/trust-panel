import { NextRequest, NextResponse } from "next/server";
import { GROK_API_URL, GROK_MODEL, getGrokHeaders } from "@/config/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    const response = await fetch(GROK_API_URL, {
      method: "POST",
      headers: getGrokHeaders(),
      body: JSON.stringify({
        model: GROK_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant. Provide clear, detailed, well-structured answers. When making claims, be specific. When uncertain, say so.",
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Grok API error:", response.status, errorText);
      return NextResponse.json(
        { error: `Grok API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const assistantContent =
      data.choices?.[0]?.message?.content || "No response generated.";

    const chatMessage = {
      id: `msg_${Date.now()}`,
      role: "assistant" as const,
      content: assistantContent,
      timestamp: Date.now(),
    };

    return NextResponse.json({
      message: chatMessage,
      raw_content: assistantContent,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
