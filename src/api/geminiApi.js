import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function fetchGeminiResponse(ticker, companyName) {
    const prompt = `Need an equity research report on ${companyName}. with a symbol ${ticker} with only and only these these aspects Key Strengths, Key Risks, Valuation & Recommendation, Investment Rationale and Opportunities. Do not add Date, Analyst, Disclaimer or anything else in your response.`;

    const result = await model.generateContent(prompt);

    const response = result.response;
    const text = response.text();
    return text;
}

export default fetchGeminiResponse;