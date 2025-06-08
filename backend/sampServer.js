// To run this code:
// npm install @google/genai mime dotenv
// Make sure you set GEMINI_API_KEY in a .env file or environment variable

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const ai = new GoogleGenerativeAI({
    apiKey: process.env.API_KEY,
  });

  const config = {
    responseMimeType: 'text/plain',
    systemInstruction: [
      {
        text: `IMPORTANT: This assistant is strictly forbidden from generating any non-JSON output. Any response must be valid JSON ONLY.
You are an AI assistant specialized in Electric Vehicle (EV) optimization. Your primary job is to provide practical, data-driven, and highly contextual driving recommendations by strictly using the provided input JSON and real-time data gathered from tools.
Critical Instruction: DO NOT generate advice using assumptions or placeholders. Only rely on the provided JSON and tool-based data. No guessing.

---

### TASK INSTRUCTIONS:

1. Use Input JSON EXACTLY As-Is
   The input is structured and contains the following fields. Use their exact values without rewriting or paraphrasing:

   - \`location\`: \`{{ $json.body.location }}\`
   - \`destination\`: \`{{ $json.body.destination }}\`
   - \`battery_level_percent\`: \`{{ $json.body.battery_level_percent }}\`
   - \`estimated_range_km\`: \`{{ $json.body.estimated_range_km }}\`
   - \`current_time\`: \`{{ $json.body.current_time }}\`
   - \`current_day\`: \`{{ $json.body.current_day }}\`
   - \`vehicle_model\`: \`{{ $json.body.vehicle_model }}\` (optional)

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
Return ONLY valid, minified JSON as described above. No natural language. No explanations. No markdown.`,
      },
    ],
  };

  const model = 'gemini-2.0-flash';

  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `prompt: 'Based on the following data, provide a travel recommendation:\\n' +
      '{\\n' +
      '  "location": "saravanapatti",\\n' +
      '  "destination": "dharapuram",\\n' +
      '  "battery_level_percent": 45,\\n' +
      '  "estimated_range_km": 100,\\n' +
      '  "current_time": "08:33 am",\\n' +
      '  "current_day": "Saturday",\\n' +
      '  "vehicle_model": "tata nexon ev"\\n' +
      '}'`,
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: `\`\`\`json
{"performance_state":"Moderate energy consumption expected due to potential traffic. Monitor battery during the trip.","battery_advice":"Battery level is at 45%. Range is 100km. Consider charging before or during the trip to avoid range anxiety.","next_charge_recommendation":"Plan for a charging stop if the remaining range drops below 30km.","range_stat":"Current estimated range: 100 km.","charge_recommandation":"Charging is recommended either before starting or midway through the journey, depending on real-time consumption.","suggested_charge_type":"Fast charging is advisable to minimize travel time.","contextual_driving_advice":"Drive conservatively, especially in heavy traffic, to maximize range. Use regenerative braking effectively.","suggested_route_info":{"origin":"saravanapatti","destination":"dharapuram","duration":"PT2H3M","distance":"94.2 km","summary":"via NH81","map_url":"https://www.google.com/maps/dir/?api=1&origin=saravanapatti&destination=dharapuram&travelmode=driving"}}
\`\`\``,
        },
      ],
    },
    {
      role: 'user',
      parts: [
        {
          text: 'INSERT_INPUT_HERE',
        },
      ],
    },
  ];
  

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  for await (const chunk of response) {
    console.log(chunk.text);
  }
}

main();
