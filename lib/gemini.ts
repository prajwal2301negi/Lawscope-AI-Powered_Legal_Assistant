import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey || apiKey === 'your-api-key-here') {
  console.warn('Gemini API key not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file.');
}

const genAI = apiKey && apiKey !== 'your-api-key-here' ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI ? genAI.getGenerativeModel({ model: 'gemini-2.5-pro' }) : null;

function checkApiKey(): void {
  if (!apiKey || apiKey === 'your-api-key-here') {
    throw new Error('Gemini API key not configured. Please add your API key to the .env.local file.');
  }
}

export async function generateSimplification(legalText: string): Promise<string> {
  try {
    checkApiKey();
    
    if (!model) {
      throw new Error('Gemini model not initialized');
    }

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
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating simplification:', error);
    if (error instanceof Error && error.message.includes('API key')) {
      throw new Error('API key not configured. Please set up your Gemini API key in the .env.local file.');
    }
    throw new Error('Failed to generate simplification. Please check your API configuration.');
  }
}

export async function generateChatResponse(userQuery: string): Promise<string> {
  try {
    checkApiKey();
    
    if (!model) {
      throw new Error('Gemini model not initialized');
    }

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
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating chat response:', error);
    if (error instanceof Error && error.message.includes('API key')) {
      throw new Error('API key not configured. Please set up your Gemini API key in the .env.local file.');
    }
    throw new Error('Failed to generate response. Please check your API configuration.');
  }
}

export async function generateScenarioAnalysis(scenarioData: string): Promise<string> {
  try {
    checkApiKey();
    
    if (!model) {
      throw new Error('Gemini model not initialized');
    }

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
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating scenario analysis:', error);
    if (error instanceof Error && error.message.includes('API key')) {
      throw new Error('API key not configured. Please set up your Gemini API key in the .env.local file.');
    }
    throw new Error('Failed to generate scenario analysis. Please check your API configuration.');
  }
}