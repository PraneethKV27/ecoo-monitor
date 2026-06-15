# Ecoo-Monitor: Smart Farm Monitor 🌾

Ecoo-Monitor is a sustainable agriculture platform designed to empower farmers with data-driven insights. It provides real-time sensor monitoring, predictive crop suitability recommendations, plant disease detection, and an AI-powered farming chatbot assistant.

---

## 🚀 Key Features

*   **📊 Real-time Sensor Dashboard:** Monitors environmental metrics via ThingSpeak (soil moisture, temperature, humidity, etc.) to optimize water usage and field conditions.
*   **🌾 Intelligent Crop Advisor (Predictive):** 
    *   Recommends the best crops to grow based on farmer's location, land size, and soil nature.
    *   **Backend Predictive Engine:** Uses linear regression algorithms to analyze 5-year historical trends of crop performance and forecast **2026 projected estimates** for profit, investment, and yield.
    *   Interactive pop-up charts showing historical trends of profits, losses, investment, and yield for each crop.
*   **💾 Database Persistence:** Automatically logs farmer registrations (Name, Land Area, Location) into a persistent SQLite database. The page displays a live "Database Log" feed of recently registered farmers.
*   **🍂 Leaf Disease Diagnosis:** Allows farmers to upload photos of leaves for instant identification of common plant diseases (like Late Blight, Leaf Mold, Common Rust, or Apple Scab) along with severity reports, causes, and treatment suggestions.
*   **💬 Interactive Farmer Chatbot:** A helper bot that answers agricultural queries regarding irrigation practices, pest control, fertilizer recommendations, and crop care.

---

## 🛠️ Technology Stack

*   **Frontend:** Semantic HTML5, Custom Responsive CSS (Modern UI, interactive charts, and animations), and Vanilla Javascript.
*   **Backend:** Node.js with Express.
*   **Dependencies:**
    *   `sqlite3` - Local file persistence database.
    *   `simple-statistics` - Backend linear regression and data analysis model.
    *   `dotenv` - Secure credential/key environment manager.
    *   `multer` - Leaf image uploads system.
    *   `axios` - Fetching IoT sensor feeds from ThingSpeak APIs.
    *   `cors` - Cross-Origin Resource Sharing middleware.

---

## ⚙️ How to Setup & Run Locally

Follow these steps to run the application on your computer:

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### 2. Configure Environment Variables
Create a file named `.env` in the root directory and add the following config keys:
```env
PORT=3000
THINGSPEAK_API_KEY=YOUR_KEY
THINGSPEAK_CHANNEL_ID=YOUR_CHANNEL
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the Server
```bash
npm start
```
The server will run at: **`http://localhost:3000`** and automatically create a `database.sqlite` file.

---

## 📁 Project Structure

```text
ecoo-monitor/
├── backend/
│   └── server.js         # Express Server, SQLite DB connector, and Analysis API
├── css/
│   └── style.css         # Modern, custom styles and styling variables
├── js/
│   └── dashboard.js      # Frontend logic and charts integration
├── uploads/              # Upload directory for uploaded crop leaf images
├── .env                  # Environment configurations (hidden keys)
├── database.sqlite       # Local persistent database file (auto-generated)
├── index.html            # Main Landing page
├── dashboard.html        # IoT Sensors and Metrics Dashboard
├── crop-advisor.html     # Farmer Details & Predictive analytics analyzer
├── disease.html          # Leaf disease detection scanner
├── chatbot.html          # Farming helper chat interface
├── .gitignore            # Excludes node_modules/, database.sqlite, and uploads/ from Git
└── package.json          # Node dependencies and scripts configuration
```
