import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

// Setup Express server
const app = express();
const port = process.env.PORT || 3001;
const mainprompt = process.env.PROMPT || "";
app.use(express.json());

const allowedOrigins = ['*']; // Add more as needed

// const cors = require('cors');
// const bodyParser = require('body-parser');

app.use(cors({
  origin: '*', // allow all origins
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(bodyParser.json());

// Google Gemini setup
const gemini_api_key = process.env.API_KEY;
const googleAI = new GoogleGenerativeAI(gemini_api_key);

const geminiConfig = {

  temperature: 1,
  topP: 0.95,
  topK: 1,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
  systemInstruction: [
    {
      role:"user",
      parts: [

        {text: `IMPORTANT: This assistant is strictly forbidden from generating any non-JSON output. Any response must be valid JSON ONLY.
  You are an AI assistant specialized in Electric Vehicle (EV) optimization. Your primary job is to provide practical, data-driven, and highly contextual driving recommendations by strictly using the provided input JSON and real-time data gathered from tools.
  Critical Instruction: DO NOT generate advice using assumptions or placeholders. Only rely on the provided JSON and tool-based data. No guessing.
  
  ---
  
  ### TASK INSTRUCTIONS:
  
  1. Use Input JSON EXACTLY As-Is
   The input is structured and contains the following fields. Use their exact values without rewriting or paraphrasing:
  {
    "location" : "User location"
    "destination" : "User destination"
    "battery_level_percent" : "battery level percent"
    "estimated_range_km" : "estimated range km"
    "current_time" : "current time"
    "current_day" : "current day"
    "vehicle_model" : "vehicle model" (optional)
  }
  
  2. Use Tools to Fetch Real-Time Data
   Using the \`location\` value from input:
   - Fetch the current weather condition.
   - Fetch the current temperature in Celsius.
   - Fetch the real-time traffic conditions for the route.
  
     No fake or assumed values allowed. You must use tool results.
  
  3. Find Route from \`location\` to \`destination\`
   - Use real-time navigation tools to find possible driving routes.
   - Choose the route with the shortest estimated duration.
   - Extract the following from the selected route:
     - \`duration\`, \`distance\`, \`summary\`, and \`map_url\`.
  
  4. Synthesize Output JSON
   Combine the input data and real-time results to form a complete JSON output. The final output MUST FOLLOW this structure strictly:
  
   
    \`\`\`json
    {"performance_state":"string",
    "battery_advice":"string",
    "next_charge_recommendation":"string",
    "range_stat":"string",
    "charge_recommandation":"string",
    "suggested_charge_type":"string",
    "contextual_driving_advice":"string",
    "suggested_route_info":
      {"origin":"string",
      "destination":"string",
      "duration":"string",
      "distance":"string",
      "summary":"string",
      "map_url":"string"
      }
    }
    \`\`\`
    
  5. Your Output Must Be PURE JSON
  Do not include comments, notes, explanations, markdown, or anything outside of the JSON structure.
  
  IMPORTANT: This assistant is strictly forbidden from generating any non-JSON output. Any response must be valid JSON ONLY.
  Return ONLY valid, minified JSON as described above. No natural language. No explanations. No markdown.`,}
      ]
    },
  ],
};

// Route - POST /api/chat
app.post('/api/chat', async (req, res) => {
  const userPrompt = req.body?.prompt;

  if (!userPrompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    const geminiModel = googleAI.getGenerativeModel({
      model: "gemini-2.0-flash", 
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
      contents: [
          {
            role: 'user',
            parts: [
              { text: `{
            "location" : "Saravanapatti"
            "destination" : "dharapuram"
            "battery_level_percent" : "76%"
            "estimated_range_km" : "100"
            "current_time" : "17:29"
            "current_day" : "Sunday"
            "vehicle_model" : "Tata nexon EV"
          }` },
            ],
          },
          {
            role: 'model',
            parts: [
              { text: `\`\`\`json
                  {"performance_state":"Normal",
                  "battery_advice":"Battery level is at 76%. Optimal driving performance.",
                  "next_charge_recommendation":"Monitor battery. Plan a charge stop if the remaining range drops below 30km, especially if weather conditions worsen or traffic increases.",
                  "range_stat":"Sufficient range for the trip. Maintain moderate speed for optimal efficiency.",
                  "charge_recommandation":"Consider charging to 100% at the next available charging station for extended range and to avoid range anxiety.",
                  "suggested_charge_type":"Fast charging is recommended for a quick top-up if needed, otherwise, standard charging is sufficient.",
                  "contextual_driving_advice":"Drive cautiously, considering the weather conditions and traffic. Utilize regenerative braking to maximize range.",
                  "suggested_route_info":
                  {"origin":"Saravanapatti",
                  "destination":"dharapuram",
                  "duration":"0 hr 57 min",
                  "distance":"56.2 km",
                  "summary":"via SH 81",
                  "map_url":"https://www.google.com/maps/dir/?api=1&origin=Saravanapatti&destination=dharapuram&travelmode=driving"
                  }
                  }
                  \`\`\`` 
              },
            ],
          }
      ],
      systemInstruction: [
        {
          role:"user",
          parts: [

            {text: `IMPORTANT: This assistant is strictly forbidden from generating any non-JSON output. Any response must be valid JSON ONLY.
      You are an AI assistant specialized in Electric Vehicle (EV) optimization. Your primary job is to provide practical, data-driven, and highly contextual driving recommendations by strictly using the provided input JSON and real-time data gathered from tools.
      Critical Instruction: DO NOT generate advice using assumptions or placeholders. Only rely on the provided JSON and tool-based data. No guessing.
      
      ---
      
      ### TASK INSTRUCTIONS:
      
      1. Use Input JSON EXACTLY As-Is
      The input is structured and contains the following fields. Use their exact values without rewriting or paraphrasing:
      {
        "location" : "User location"
        "destination" : "User destination"
        "battery_level_percent" : "battery level percent"
        "estimated_range_km" : "estimated range km"
        "current_time" : "current time"
        "current_day" : "current day"
        "vehicle_model" : "vehicle model" (optional)
      }
      
      2. Use Tools to Fetch Real-Time Data
      Using the \`location\` value from input:
      - Fetch the current weather condition.
      - Fetch the current temperature in Celsius.
      - Fetch the real-time traffic conditions for the route.
      
        No fake or assumed values allowed. You must use tool results.
      
      3. Find Route from \`location\` to \`destination\`
      - Use real-time navigation tools to find possible driving routes.
      - Choose the route with the shortest estimated duration.
      - Extract the following from the selected route:
        - \`duration\`, \`distance\`, \`summary\`, and \`map_url\`.
      
      4. Synthesize Output JSON
      Combine the input data and real-time results to form a complete JSON output. The final output MUST FOLLOW this structure strictly:
      
      
        \`\`\`json
        {"performance_state":"string",
        "battery_advice":"string",
        "next_charge_recommendation":"string",
        "range_stat":"string",
        "charge_recommandation":"string",
        "suggested_charge_type":"string",
        "contextual_driving_advice":"string",
        "suggested_route_info":
          {"origin":"string",
          "destination":"string",
          "duration":"string",
          "distance":"string",
          "summary":"string",
          "map_url":"string"
          }
        }
        \`\`\`
        
      5. Your Output Must Be PURE JSON
      Do not include comments, notes, explanations, markdown, or anything outside of the JSON structure.
      
      IMPORTANT: This assistant is strictly forbidden from generating any non-JSON output. Any response must be valid JSON ONLY.
      Return ONLY valid, minified JSON as described above. No natural language. No explanations. No markdown.`}
          ]
        },
      ],

    });

    const usrprmpt = 'Based on the following data, provide a travel recommendation:\n' +
'{\n' +
'  "location": "saravanapatti",\n' +
'  "destination": "dharapuram",\n' +
'  "battery_level_percent": 45,\n' +
'  "estimated_range_km": 100,\n' +
'  "current_time": "08:33 am",\n' +
'  "current_day": "Saturday",\n' +
'  "vehicle_model": "tata nexon ev"\n' +
'}'

    const result = await geminiModel.generateContent(userPrompt);
    const responseText = result.response.text();

    console.log(responseText);
    // console.log(req);

    res.json({ response: responseText });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: 'Failed to generate content.' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});


/*

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { response } from "express";
dotenv.config();
 
const gemini_api_key = process.env.API_KEY;
const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 4096,
  responseMimwType: "text/plain",
};
 
const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  geminiConfig,
});
 
const generate = async () => {
  const chatSession = geminiModel.startChat({
    geminiConfig,
    history: [
    ]
  });
  try {
    const prompt = "Tell me about google.";
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    console.log(response.text());
  } catch (error) {
    console.log("response error", error);
  }
};
 
generate();

*/