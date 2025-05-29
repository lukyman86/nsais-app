const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// API untuk cuaca (proxy ke OpenWeatherMap)
app.get('/api/cuaca', async (req, res) => {
    const apiKey = 'ISI_API_KEY_MU_DI_SINI';
    const city = req.query.city || 'Jakarta';
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Gagal mengambil data cuaca' });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
