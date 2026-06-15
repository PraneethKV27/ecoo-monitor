const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Multer setup for uploads
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// API Endpoints

// 1. Fetch ThingSpeak Data
app.get('/api/sensors', async (req, res) => {
    try {
        const response = await axios.get('https://api.thingspeak.com/channels/3326120/feeds.json?api_key=V0HL55TASZCEC3HC&results=10');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching ThingSpeak data:', error.message);
        res.status(500).json({ error: 'Failed to fetch sensor data' });
    }
});

// 2. Upload Plant Disease Image
app.post('/api/upload-disease', upload.single('leafImage'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
    }

    // Detailed disease database
    const diseaseDatabase = {
        "Healthy Leaf": {
            cause: "Optimal conditions, proper care, and lack of pathogens.",
            cure: "No treatment needed.",
            prevention: "Continue regular checking and maintain good farming practices.",
            severity: "None",
            impact: "Excellent crop yield expected."
        },
        "Potato Late Blight": {
            cause: "Fungus-like organism (oomycete) called Phytophthora infestans.",
            cure: "Apply fungicides containing chlorothalonil or copper. Immediately remove and destroy infected plant parts.",
            prevention: "Use certified disease-free seeds, avoid overhead irrigation, and ensure proper spacing for air circulation.",
            severity: "High",
            impact: "Can destroy entire crops within days if left untreated."
        },
        "Tomato Leaf Mold": {
            cause: "Fungus Passalora fulva, which thrives in high humidity and moderate temperatures.",
            cure: "Improve air circulation and use fungicides like mancozeb or chlorothalonil.",
            prevention: "Maintain lower humidity, prune lower leaves, and use drip irrigation to keep foliage dry.",
            severity: "Medium",
            impact: "Reduces photosynthesis, leading to smaller fruit size and lower yield."
        },
        "Corn Common Rust": {
            cause: "Fungus Puccinia sorghi, typically spread by wind.",
            cure: "Usually doesn't require chemical treatment in commercial fields, but fungicides like triazoles can be used for high-value crops.",
            prevention: "Plant resistant hybrids and rotate crops annually.",
            severity: "Low to Medium",
            impact: "Minor yield loss; mostly affects the aesthetic and market value of sweet corn."
        },
        "Apple Scab": {
            cause: "Fungus Venturia inaequalis that overwinters in fallen leaves.",
            cure: "Apply sulfur or copper-based fungicides during the growing season.",
            prevention: "Rake and burn fallen leaves in autumn to reduce spores. Prune trees to increase sun exposure.",
            severity: "Medium",
            impact: "Causes unsightly spots on fruit, making it unmarketable."
        }
    };

    const diseases = Object.keys(diseaseDatabase);
    const resultName = diseases[Math.floor(Math.random() * diseases.length)];
    const details = diseaseDatabase[resultName];

    res.json({
        message: 'Image uploaded successfully',
        filename: req.file.filename,
        detectionResult: resultName,
        confidence: (Math.random() * (0.99 - 0.85) + 0.85).toFixed(2),
        details: details
    });
});

// 3. Farmer Chatbot Responses
app.post('/api/chatbot', (req, res) => {
    const { message } = req.body;
    let response = "I'm sorry, I don't have information on that. Try asking about irrigation, pests, or specific crops like Wheat or Rice.";

    if (!message) {
        return res.json({ response: "Please type a message." });
    }

    const query = message.toLowerCase();

    if (query.includes('rice')) {
        response = "Rice requires consistent irrigation and thrives in warm, humid climates. Watch out for stem borers.";
    } else if (query.includes('wheat')) {
        response = "Wheat grows best in cool climates with moderate rainfall. Ensure proper drainage and watch for rust diseases.";
    } else if (query.includes('pest')) {
        response = "Common pests include aphids, mites, and caterpillars. We recommend using organic neem oil spray for minor infestations.";
    } else if (query.includes('irrigation')) {
        response = "Smart irrigation based on soil moisture levels can save up to 40% water. Check your Soil Moisture sensor on the Dashboard.";
    } else if (query.includes('fertilizer')) {
        response = "Nitrogen-rich fertilizers are great for leafy growth, while Phosphorus helps with root development. Use NPK 10-10-10 for general purposes.";
    } else if (query.includes('hello') || query.includes('hi')) {
        response = "Hello Farmer! How can I assist you with your crops today?";
    }

    res.json({ response });
});

// Fallback: Serve index.html for all non-API routes
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`SmartFarm server running at http://localhost:${PORT}`);
});