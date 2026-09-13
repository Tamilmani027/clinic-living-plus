import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { reason } = await req.json();

    if (!reason || typeof reason !== "string" || !reason.trim()) {
      return NextResponse.json({ summary: "" });
    }

    const trimmedReason = reason.trim();
    const hfKey = process.env.HUGGINGFACE_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    // 1. Try Groq if key is present (Fast & free tier available)
    if (groqKey) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${groqKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              {
                role: "system",
                content:
                  "You are a medical triage assistant. Summarize the patient's symptoms into a concise 1-2 sentence clinical summary suitable for an intake note.",
              },
              { role: "user", content: trimmedReason },
            ],
            max_tokens: 80,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const summary = data.choices?.[0]?.message?.content?.trim();
          if (summary) return NextResponse.json({ summary });
        }
      } catch (err) {
        console.warn("Groq API error, falling back:", err);
      }
    }

    // 2. Try OpenAI if key is present
    if (openaiKey) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openaiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are a medical triage assistant. Provide a brief 1-2 sentence clinical triage note from the patient's symptoms.",
              },
              { role: "user", content: trimmedReason },
            ],
            max_tokens: 80,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const summary = data.choices?.[0]?.message?.content?.trim();
          if (summary) return NextResponse.json({ summary });
        }
      } catch (err) {
        console.warn("OpenAI API error, falling back:", err);
      }
    }

    // 3. Try Hugging Face Inference API
    if (hfKey) {
      try {
        const response = await fetch(
          "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
          {
            headers: {
              Authorization: `Bearer ${hfKey}`,
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              inputs: `Patient clinical complaints: ${trimmedReason}. Clinical triage summary:`,
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          const summary = result[0]?.summary_text;
          if (summary) return NextResponse.json({ summary: summary.trim() });
        }
      } catch (err) {
        console.warn("Hugging Face API error, falling back:", err);
      }
    }

    // 4. Intelligent clinical fallback (works zero-config without external API keys)
    const lower = trimmedReason.toLowerCase();
    let synthesis = "";

    if (lower.includes("fever") || lower.includes("cough") || lower.includes("cold") || lower.includes("flu")) {
      synthesis = "Presents with acute upper respiratory/febrile symptoms. Recommend vitals triage and infection screening.";
    } else if (lower.includes("chest") || lower.includes("heart") || lower.includes("palpit") || lower.includes("breath")) {
      synthesis = "Reported intermittent chest discomfort/cardiorespiratory symptoms. Recommend ECG and expedited cardiology triage.";
    } else if (lower.includes("head") || lower.includes("migrain") || lower.includes("dizzy")) {
      synthesis = "Reports cephalalgia / neurological symptoms. Flagged for neurological triage and blood pressure check.";
    } else if (lower.includes("stomach") || lower.includes("pain") || lower.includes("vomit") || lower.includes("nausea")) {
      synthesis = "Presents with gastrointestinal distress. Recommend abdominal examination and hydration status assessment.";
    } else {
      synthesis = `Patient reports: "${trimmedReason.slice(0, 110)}${trimmedReason.length > 110 ? "..." : ""}". Synthesized for initial clinical review.`;
    }

    return NextResponse.json({ summary: synthesis });
  } catch (error) {
    console.error("AI summary generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
