import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    'Gemini API key not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file.'
  );
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI ? genAI.getGenerativeModel({ model: 'gemini-2.5-pro' }) : null;

function checkApiKey(): void {
  if (!apiKey || apiKey === 'your-api-key-here') {
    throw new Error(
      'Gemini API key not configured. Please add your API key to the .env.local file.'
    );
  }
}

// ----------------- Helper Functions -----------------

async function generateSimplification(legalText: string): Promise<string> {
  checkApiKey();
  if (!model) throw new Error('Gemini model not initialized');

  const prompt = `
    You are a legal expert specializing in simplifying complex legal documents for general public understanding.

    Please analyze the following legal text and provide:
    1. A simplified version in plain English
    2. Key points as bullet points
    3. Real-world examples where applicable

    Format your response as:
    Original: [relevant section]
    Simplified: [plain English explanation]

    Legal Text:
    ${legalText}

    Please make it accessible to someone with no legal background.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function generateChatResponse(userQuery: string): Promise<string> {
  checkApiKey();
  if (!model) throw new Error('Gemini model not initialized');

  const prompt = `
    You are a helpful legal assistant. Answer the following legal question in simple, understandable terms.
    
    Provide:
    1. A direct answer to the question
    2. Important considerations or exceptions
    3. When to seek professional legal help
    
    Remember to:
    - Use plain English
    - Avoid legal jargon
    - Be helpful but remind users this is not formal legal advice
    
    User Question: ${userQuery}
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function generateScenarioAnalysis(scenarioData: string): Promise<string> {
  checkApiKey();
  if (!model) throw new Error('Gemini model not initialized');

  const prompt = `
    You are a legal analyst. Analyze the following scenario and provide:
    
    1. A clear explanation of the legal situation
    2. Potential risks and consequences
    3. Rights and protections available
    4. Recommended next steps
    5. When immediate legal help is needed
    
    Please provide practical, actionable advice in plain English.
    
    Scenario: ${scenarioData}
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

// ----------------- API Route Handler -----------------

export async function POST(req: Request) {
  try {
    const { type, text } = await req.json();

    if (!type || !text) {
      return NextResponse.json(
        { error: 'Missing required fields: type or text' },
        { status: 400 }
      );
    }

    let responseText: string;

    switch (type) {
      case 'simplify':
        responseText = await generateSimplification(text);
        break;
      case 'chat':
        responseText = await generateChatResponse(text);
        break;
      case 'scenario':
        responseText = await generateScenarioAnalysis(text);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid type. Use simplify, chat, or scenario' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, result: responseText });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
