# Ecoo-Monitor: Smart Farm Monitor 🌾

Ecoo-Monitor is a sustainable agriculture platform designed to empower farmers with data-driven insights. It provides real-time sensor monitoring, crop suitability recommendations, plant disease detection, and an AI-powered farming chatbot assistant.

---

## 🚀 Key Features

*   **📊 Real-time Sensor Dashboard:** Monitors environmental metrics via ThingSpeak (soil moisture, temperature, humidity, etc.) to optimize water usage and field conditions.
*   **🌾 Intelligent Crop Advisor:** 
    *   Recommends the best crops to grow based on farmer's location, land size, and soil nature.
    *   Provides estimated investments, projected profits, and expected yields calculated from historical 5-year data.
    *   Interactive pop-up charts showing historical trends of profits, losses, investment, and yield for each crop.
*   **🍂 Leaf Disease Diagnosis:** Allows farmers to upload photos of leaves for instant identification of common plant diseases (like Late Blight, Leaf Mold, Common Rust, or Apple Scab) along with severity reports, causes, and treatment suggestions.
*   **💬 Interactive Farmer Chatbot:** A helper bot that answers agricultural queries regarding irrigation practices, pest control, fertilizer recommendations, and crop care.

---

## 🛠️ Technology Stack

*   **Frontend:** Semantic HTML5, Custom Responsive CSS (Modern UI, interactive charts, and animations), and Vanilla Javascript.
*   **Backend:** Node.js with Express.
*   **Dependencies:** Multer (image uploads), Axios (fetching IoT sensor data from ThingSpeak APIs), and Cors.

---

## ⚙️ How to Setup & Run Locally

Follow these steps to run the application on your computer:

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### 2. Clone the Repository
```bash
git clone https://github.com/PraneethKV27/ecoo-monitor.git
cd ecoo-monitor
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the Server
```bash
npm start
```
The server will run at: **`http://localhost:3000`**

---

## 📁 Project Structure

```text
ecoo-monitor/
├── backend/
│   └── server.js         # Express Server and API Endpoints (Sensors, Disease, Chatbot)
├── css/
│   └── style.css         # Modern, custom styles and styling variables
├── js/
│   └── dashboard.js      # Frontend logic and charts integration
├── uploads/              # Upload directory for uploaded crop leaf images
├── index.html            # Main Landing page
├── dashboard.html        # IoT Sensors and Metrics Dashboard
├── crop-advisor.html     # Farmer Details input & Crop analysis report generator
├── disease.html          # Leaf disease detection scanner
├── chatbot.html          # Farming helper chat interface
├── .gitignore            # Excludes node_modules/ and uploads/ from Git
└── package.json          # Node dependencies and scripts configuration
```
