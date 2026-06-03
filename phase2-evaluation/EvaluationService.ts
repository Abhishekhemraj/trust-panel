import { EvaluationResult } from "@/types/evaluation";

export async function runEvaluation(
  userPrompt: string,
  aiResponse: string
): Promise<EvaluationResult | null> {
  try {
    const response = await fetch("/api/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_prompt: userPrompt,
        content: aiResponse,
      }),
    });

    if (!response.ok) {
      console.error("Evaluation API error:", response.status);
      return null;
    }

    const data = await response.json();
    return data.evaluation as EvaluationResult;
  } catch (error) {
    console.error("Evaluation service error:", error);
    return null;
  }
}
