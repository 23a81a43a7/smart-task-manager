import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';

/**
 * @swagger
 * /api/ai/suggest-tasks:
 *   post:
 *     summary: Generate task suggestions based on user input (Mock AI)
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */
import { GoogleGenerativeAI } from '@google/generative-ai';

export const suggestTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      res.status(400).json({ message: 'Prompt is required' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      // Fallback response for testing UI without API key
      const suggestions = [
        { title: `[API Key Required] for: ${prompt}`, description: `Please get a free API key from Google AI Studio and put GEMINI_API_KEY in your server/.env file!`, priority: 'High' }
      ];
      res.json({ suggestions });
      return;
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `You are a helpful task planning assistant. Based on the user's prompt, generate 3 specific, actionable tasks they should complete. 
    Respond ONLY with a valid JSON array of objects representing the tasks. Do not include text, markdown, or code blocks around the JSON array.
    Each task object must have exactly these keys: "title" (string), "description" (string), "priority" (string: "Low", "Medium", or "High").
    User request: `;

    const result = await model.generateContent(systemPrompt + prompt);
    const outputText = result.response.text();
    
    try {
      // Clean up markdown in case the model ignores instructions
      const cleanJson = outputText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const suggestions = JSON.parse(cleanJson);
      res.json({ suggestions });
    } catch (parseError) {
      console.error('Failed to parse AI response:', outputText);
      res.status(500).json({ message: 'Failed to process AI task suggestions.', raw: outputText });
    }

  } catch (error: any) {
    console.error('AI Error:', error);
    res.status(500).json({ message: error.message });
  }
};
