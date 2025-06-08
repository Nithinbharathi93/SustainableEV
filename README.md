# SustainableEV 🚗⚡

An AI-powered Electric Vehicle (EV) optimization assistant that delivers **real-time, data-driven** route planning and battery usage recommendations. This project strictly relies on live data tools and structured input to generate optimized driving instructions, eliminating assumptions and default behavior.

## 🔗 GitHub Repository

[https://github.com/Nithinbharathi93/SustainableEV](https://github.com/Nithinbharathi93/SustainableEV)

---

## 📌 Features

- ✅ Live weather and traffic data integration
- ✅ Intelligent route selection based on real-time duration and distance
- ✅ Battery level awareness and charging strategy suggestions
- ✅ Contextual advice for efficient EV driving
- ✅ Strict JSON-based API response – no guesswork
- ✅ Tool-based logic for production-ready automation

---

## 📥 Input JSON Structure

The API expects the following fields in the request body:

```json
{
  "location": "Coimbatore, Tamil Nadu",
  "destination": "Bangalore, Karnataka",
  "battery_level_percent": 60,
  "estimated_range_km": 220,
  "current_time": "14:30",
  "current_day": "Saturday",
  "vehicle_model": "Tata Nexon EV"
}
````

---

## 📤 Output JSON Structure

The response is a strictly formatted JSON with driving advice and route info:

```json
{
  "performance_state": "string",
  "battery_advice": "string",
  "next_charge_recommendation": "string",
  "range_stat": "string",
  "charge_recommandation": "string",
  "suggested_charge_type": "string",
  "contextual_driving_advice": "string",
  "suggested_route_info": {
    "origin": "string",
    "destination": "string",
    "duration": "string",
    "distance": "string",
    "summary": "string",
    "map_url": "string"
  }
}
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Nithinbharathi93/SustainableEV.git
cd SustainableEV
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Set up API keys and tool integrations (e.g., weather, maps) in a `.env` file:

```env
VITE_SERVER_URL=your_key_here
GOOGLE_CLOUD_PROJECT_ID=your_key_here
GOOGLE_CLOUD_REGION=your_key_here
API_KEY=your_key_here
PROMPT==your_key_here
```

### 4. Run the App

```bash
npm start
```

---

## 🛠️ Tech Stack

* Node.js / Express.js
* External APIs for weather, traffic, and navigation
* JSON-based interface design
* Real-time data processing

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 👤 Author

**Nithinbharathi T**
[GitHub Profile](https://github.com/Nithinbharathi93) | [LinkedIn](https://www.linkedin.com/in/nithinbharathi)


---
