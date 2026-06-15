let charts = {};

const createChart = (id, label, color) => {
    const ctx = document.getElementById(id).getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: label,
                data: [],
                borderColor: color,
                backgroundColor: color + '33',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
};

const initCharts = () => {
    charts.temp = createChart('tempChart', 'Temperature', '#ef4444');
    charts.humidity = createChart('humidityChart', 'Humidity', '#3b82f6');
    charts.soil = createChart('soilChart', 'Soil Moisture', '#10b981');
    charts.air = createChart('airChart', 'Air Quality', '#8b5cf6');
    charts.waterTemp = createChart('waterTempChart', 'Water Temp', '#0ea5e9');
};

const updateUI = (feeds) => {
    if (!feeds || feeds.length === 0) return;

    const latest = feeds[feeds.length - 1];
    
    document.getElementById('temp-value').innerText = latest.field1 || '0';
    document.getElementById('humidity-value').innerText = latest.field2 || '0';
    document.getElementById('soil-value').innerText = (latest.field6 || '0') + '%';
    document.getElementById('air-value').innerText = latest.field5 || '0';
    document.getElementById('water-temp-value').innerText = latest.field7 || '0';
    
    const date = new Date(latest.created_at);
    document.getElementById('last-updated').innerText = date.toLocaleTimeString();

    const waterTemp = parseFloat(latest.field7 || 0);
    const motorIndicator = document.getElementById('motor-indicator');
    const motorText = document.getElementById('motor-text');

    if (waterTemp > 35) {
        motorIndicator.className = 'status-indicator status-on';
        motorText.innerText = 'Motor ON';
        motorText.style.color = 'var(--primary)';
    } else {
        motorIndicator.className = 'status-indicator status-off';
        motorText.innerText = 'Motor OFF';
        motorText.style.color = 'var(--text-muted)';
    }

    const labels = feeds.map(f => new Date(f.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    
    charts.temp.data.labels = labels;
    charts.temp.data.datasets[0].data = feeds.map(f => parseFloat(f.field1 || 0));
    charts.temp.update();

    charts.humidity.data.labels = labels;
    charts.humidity.data.datasets[0].data = feeds.map(f => parseFloat(f.field2 || 0));
    charts.humidity.update();

    charts.soil.data.labels = labels;
    charts.soil.data.datasets[0].data = feeds.map(f => parseFloat(f.field6 || 0));
    charts.soil.update();

    charts.air.data.labels = labels;
    charts.air.data.datasets[0].data = feeds.map(f => parseFloat(f.field5 || 0));
    charts.air.update();

    charts.waterTemp.data.labels = labels;
    charts.waterTemp.data.datasets[0].data = feeds.map(f => parseFloat(f.field7 || 0));
    charts.waterTemp.update();
};

const fetchData = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/sensors');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        updateUI(data.feeds);
    } catch (err) {
        console.warn('Backend server not detected, using real-time simulation data.');
        // Fast Data Simulation
        const mockFeeds = [];
        const now = new Date();
        for (let i = 9; i >= 0; i--) {
            mockFeeds.push({
                created_at: new Date(now.getTime() - i * 60000).toISOString(),
                field1: (25 + Math.random() * 5).toFixed(1), // Temp
                field2: (60 + Math.random() * 10).toFixed(1), // Humidity
                field5: (400 + Math.random() * 50).toFixed(0), // Air
                field6: (70 + Math.random() * 15).toFixed(0), // Soil
                field7: (30 + Math.random() * 8).toFixed(1)   // Water Temp
            });
        }
        updateUI(mockFeeds);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    fetchData();
    setInterval(fetchData, 30000);
});