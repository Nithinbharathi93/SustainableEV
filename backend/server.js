import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  HarmCategory,
  HarmBlockThreshold,
  VertexAI
} from '@google-cloud/vertexai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// ENV Variables
const project = process.env.GOOGLE_CLOUD_PROJECT_ID;
const location = process.env.GOOGLE_CLOUD_REGION;
const predefinedPrompt = process.env.PROMPT || 'You are a helpful assistant.';

// Initialize Vertex AI
const vertexAI = new VertexAI({ project, location });

// Instantiate Gemini 2.0 Flash text model
const generativeModel = vertexAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  systemInstruction: {
    role: 'system',
    parts: [{ text: predefinedPrompt }]
  },
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    }
  ],
  generationConfig: {
    maxOutputTokens: 256
  }
});

// Route - Chat
app.post('/api/chat', async (req, res) => {
    const userData = req.body;
    const { conversationHistory = [] } = req.body;
  
    if (!userData) {
      return res.status(400).json({ error: 'User data is required.' });
    }
  
    const chatPrompt = `${predefinedPrompt} ${JSON.stringify(userData, null, 2)}`;
    console.log('Sending prompt:', chatPrompt);
  
    try {
      const result = await generativeModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: chatPrompt }] }],
      });
  
      const aiResponse = result.response.candidates[0].content.parts[0].text;
      console.log('Raw AI Response:', aiResponse);
  
      const cleanedResponse = aiResponse.replace(/```json|```/g, '').trim();
  
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(cleanedResponse);
      } catch (jsonErr) {
        console.error('Failed to parse response:', jsonErr);
        return res.status(500).json({
          error: 'Gemini returned invalid JSON.',
          raw: cleanedResponse,
        });
      }
  
      res.json(parsedResponse);
    } catch (error) {
      console.error('Error calling Gemini AI:', error);
      res.status(500).json({ error: 'Failed to get response from Gemini AI.' });
    }
  });
  

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
