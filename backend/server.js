require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const ss = require('simple-statistics');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// SQLite Database Setup
const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to local SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS farmers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            area REAL NOT NULL,
            location TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

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

// Regional Crop Data Blueprint
const regionalData = {
    north: {
        soil: "Alluvial Soil - Highly fertile, rich in potash and lime. Excellent for moisture retention.",
        nutrients: "Rich in Nitrogen & Phosphorus",
        crops: [
            { 
                name: "Wheat", best: true,
                historical: {
                    years: [2021, 2022, 2023, 2024, 2025],
                    profit: [42000, 45000, 39000, 48000, 52000],
                    loss: [2000, 1500, 3000, 1000, 500],
                    investment: [13000, 14000, 15000, 15500, 16000],
                    yield: [90, 92, 85, 94, 96]
                }
            },
            { 
                name: "Rice (Basmati)", best: false,
                historical: {
                    years: [2021, 2022, 2023, 2024, 2025],
                    profit: [55000, 60000, 58000, 65000, 70000],
                    loss: [5000, 4000, 6000, 3000, 2000],
                    investment: [18000, 20000, 21000, 22000, 23000],
                    yield: [82, 85, 80, 88, 90]
                }
            },
            { 
                name: "Sugarcane", best: false,
                historical: {
                    years: [2021, 2022, 2023, 2024, 2025],
                    profit: [80000, 85000, 82000, 90000, 95000],
                    loss: [10000, 8000, 12000, 9000, 7000],
                    investment: [25000, 27000, 29000, 30000, 32000],
                    yield: [88, 90, 84, 91, 93]
                }
            }
        ],
        suggestions: ["Implement crop rotation between Wheat and Pulses.", "Use laser land leveling.", "Monitor for yellow rust."]
    },
    south: {
        soil: "Red Soil - Porous and friable structure. Low in nitrogen.",
        nutrients: "Iron Rich, Needs Organic Matter",
        crops: [
            { 
                name: "Groundnut", best: true,
                historical: {
                    years: [2021, 2022, 2023, 2024, 2025],
                    profit: [30000, 32000, 28000, 35000, 38000],
                    loss: [3000, 2000, 4500, 1500, 1000],
                    investment: [10000, 11000, 12000, 12500, 13000],
                    yield: [88, 90, 82, 91, 94]
                }
            },
            { 
                name: "Ragi (Millets)", best: false,
                historical: {
                    years: [2021, 2022, 2023, 2024, 2025],
                    profit: [20000, 22000, 23000, 25000, 27000],
                    loss: [1000, 800, 500, 400, 300],
                    investment: [6000, 7000, 7500, 8000, 8500],
                    yield: [95, 96, 97, 98, 98]
                }
            },
            { 
                name: "Cotton", best: false,
                historical: {
                    years: [2021, 2022, 2023, 2024, 2025],
                    profit: [45000, 50000, 48000, 55000, 62000],
                    loss: [7000, 5000, 9000, 6000, 4000],
                    investment: [15000, 16000, 17000, 18000, 20000],
                    yield: [75, 78, 72, 80, 85]
                }
            }
        ],
        suggestions: ["Incorporate green manure.", "Drip irrigation for cotton.", "Regular soil testing."]
    },
    west: {
        soil: "Black Soil (Regur) - High clay content. Deep cracks in dry season.",
        nutrients: "Rich in Lime, Iron, & Magnesium",
        crops: [
            { 
                name: "Cotton (Bt)", best: true,
                historical: {
                    years: [2021, 2022, 2023, 2024, 2025],
                    profit: [65000, 70000, 62000, 75000, 82000],
                    loss: [8000, 6000, 10000, 7000, 5000],
                    investment: [18000, 19000, 20000, 21000, 22000],
                    yield: [85, 87, 80, 90, 92]
                }
            },
            { 
                name: "Soybean", best: false,
                historical: {
                    years: [2021, 2022, 2023, 2024, 2025],
                    profit: [35000, 38000, 32000, 40000, 45000],
                    loss: [4000, 3000, 5000, 3500, 2500],
                    investment: [11000, 12000, 13000, 14000, 15000],
                    yield: [88, 90, 84, 91, 93]
                }
            }
        ],
        suggestions: ["Avoid over-irrigation in rainy season.", "Sulphur application for Soybean.", "Use deep plowing."]
    },
    east: {
        soil: "Clayey Alluvial - Heavy texture with high water holding capacity.",
        nutrients: "Moderate Nitrogen & Potassium",
        crops: [
            { 
                name: "Rice", best: true,
                historical: {
                    years: [2021, 2022, 2023, 2024, 2025],
                    profit: [42000, 45000, 40000, 48000, 50000],
                    loss: [3000, 2500, 4000, 2000, 1500],
                    investment: [15000, 16000, 17000, 18000, 19000],
                    yield: [92, 94, 90, 95, 96]
                }
            },
            { 
                name: "Potato", best: false,
                historical: {
                    years: [2021, 2022, 2023, 2024, 2025],
                    profit: [70000, 75000, 65000, 85000, 90000],
                    loss: [12000, 10000, 15000, 11000, 9000],
                    investment: [20000, 22000, 24000, 25000, 27000],
                    yield: [85, 88, 80, 89, 92]
                }
            }
        ],
        suggestions: ["Perfect for paddy.", "Ensure drainage for potato.", "Use hybrid rice varieties."]
    },
    coastal: {
        soil: "Laterite Soil - Acidic in nature. Formed due to intense leaching.",
        nutrients: "Rich in Iron & Aluminum",
        crops: [
            { 
                name: "Coconut / Rubber", best: true,
                historical: {
                    years: [2021, 2022, 2023, 2024, 2025],
                    profit: [95000, 105000, 100000, 120000, 135000],
                    loss: [8000, 6000, 9000, 5000, 3000],
                    investment: [30000, 32000, 34000, 35000, 38000],
                    yield: [94, 95, 93, 97, 98]
                }
            },
            { 
                name: "Pepper", best: false,
                historical: {
                    years: [2021, 2022, 2023, 2024, 2025],
                    profit: [50000, 55000, 52000, 60000, 68000],
                    loss: [4000, 3000, 5000, 2500, 1500],
                    investment: [16000, 17000, 18000, 20000, 22000],
                    yield: [88, 90, 86, 92, 94]
                }
            }
        ],
        suggestions: ["Liming required for acidity.", "Inter-cropping pepper.", "Organic mulching."]
    }
};

// API Endpoints

// 1. Fetch ThingSpeak Data
app.get('/api/sensors', async (req, res) => {
    try {
        const channelId = process.env.THINGSPEAK_CHANNEL_ID || '3326120';
        const apiKey = process.env.THINGSPEAK_API_KEY || 'V0HL55TASZCEC3HC';
        const response = await axios.get(`https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=10`);
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

// 4. GET Registered Farmers (Database persistence)
app.get('/api/farmers', (req, res) => {
    db.all('SELECT * FROM farmers ORDER BY created_at DESC LIMIT 5', [], (err, rows) => {
        if (err) {
            console.error('Database fetch error:', err.message);
            return res.status(500).json({ error: 'Failed to fetch registered records' });
        }
        res.json(rows);
    });
});

// 5. POST Crop Advisor Analysis with regression modeling
app.post('/api/crop-advisor', (req, res) => {
    const { name, area, location } = req.body;

    if (!name || !area || !location) {
        return res.status(400).json({ error: 'Missing required field' });
    }

    // Save to SQLite
    db.run(
        'INSERT INTO farmers (name, area, location) VALUES (?, ?, ?)',
        [name, parseFloat(area), location],
        function(err) {
            if (err) {
                console.error('Database save error:', err.message);
            }
        }
    );

    const region = regionalData[location];
    if (!region) {
        return res.status(404).json({ error: 'Region not found' });
    }

    // Process and predict crops using simple-statistics linear regression
    const analyzedCrops = region.crops.map(crop => {
        const hist = crop.historical;
        const indexPairs = hist.years.map((y, idx) => [idx, y]);

        // Profit Regression
        const profitPairs = hist.years.map((y, idx) => [idx, hist.profit[idx]]);
        const profitLine = ss.linearRegression(profitPairs);
        const profitFunc = ss.linearRegressionLine(profitLine);
        const nextProfit = Math.round(profitFunc(5)); // Estimate year 6 (index 5)

        // Investment Regression
        const invPairs = hist.years.map((y, idx) => [idx, hist.investment[idx]]);
        const invLine = ss.linearRegression(invPairs);
        const invFunc = ss.linearRegressionLine(invLine);
        const nextInv = Math.round(invFunc(5));

        // Yield/Success Probability Regression
        const yieldPairs = hist.years.map((y, idx) => [idx, hist.yield[idx]]);
        const yieldLine = ss.linearRegression(yieldPairs);
        const yieldFunc = ss.linearRegressionLine(yieldLine);
        const nextYield = Math.round(yieldFunc(5));

        // Format prediction
        return {
            name: crop.name,
            best: crop.best,
            investment: `₹${nextInv.toLocaleString('en-IN')}`,
            profit: `₹${nextProfit.toLocaleString('en-IN')}`,
            historical: {
                years: [...hist.years.map(String), "2026 (Est)"],
                profit: [...hist.profit, nextProfit],
                loss: [...hist.loss, Math.round(Math.max(0, nextInv * 0.1))], // Estimated small crop overhead/loss probability
                investment: [...hist.investment, nextInv],
                yield: [...hist.yield, nextYield],
                prob: `${Math.min(100, Math.max(10, nextYield - 2))}%`
            }
        };
    });

    res.json({
        soil: region.soil,
        nutrients: region.nutrients,
        crops: analyzedCrops,
        suggestions: region.suggestions
    });
});

// Fallback: Serve index.html for all non-API routes
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`SmartFarm server running at http://localhost:${PORT}`);
});