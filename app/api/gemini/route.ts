import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// 🔹 Full prompts
function generateSimplification(text: string) {
  return `You are a legal assistant. Your task is to simplify the following legal text into plain language so that an ordinary person can understand it. Do not remove any important meaning, but make it easy to read and clear.\n\nText:\n${text}`;
}

function generateSummary(text: string) {
  return `You are a legal summarizer. Read the following legal document and provide a clear and concise summary. Focus on the essential points, obligations, and rights.\n\nText:\n${text}`;
}

function generateKeyPoints(text: string) {
  return `Extract the most important key points from the following legal text. Present them as bullet points that are easy to read and understand. Do not miss any crucial obligations or rights.\n\nText:\n${text}`;
}

function generateCaseReference(text: string) {
  return `Analyze the following legal matter and suggest relevant case law or precedents that may apply. Provide proper context but do not invent false cases.\n\nText:\n${text}`;
}

function generateActionSteps(text: string) {
  return `Based on the following legal issue, provide practical and actionable next steps a person can take. Make sure the advice is general (not jurisdiction-specific), simple, and responsible.\n\nText:\n${text}`;
}

// 🔹 API route
export async function POST(req: Request) {
  try {
    const { text, type } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    let prompt: string;
    switch (type) {
      case "simplify":
        prompt = generateSimplification(text);
        break;
      case "summary":
        prompt = generateSummary(text);
        break;
      case "keypoints":
        prompt = generateKeyPoints(text);
        break;
      case "caseref":
        prompt = generateCaseReference(text);
        break;
      case "actions":
        prompt = generateActionSteps(text);
        break;
      default:
        prompt = text; // fallback if no type provided
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const output = response.text();

    return NextResponse.json({ success: true, result: output });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
