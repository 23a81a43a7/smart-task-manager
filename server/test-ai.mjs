import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
    console.log("Testing gemini-1.5-flash...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Test prompt");
    console.log("Response 1:", result.response.text());
  } catch (e) {
    console.error("1.5-flash failed:", e.message);
    try {
      console.log("Testing gemini-pro...");
      const model2 = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result2 = await model2.generateContent("Test prompt");
      console.log("Response 2:", result2.response.text());
    } catch (e2) {
      console.error("gemini-pro failed:", e2.message);
    }
  }
}
run();
