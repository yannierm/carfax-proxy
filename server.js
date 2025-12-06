import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Carfax Proxy Server is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/carfax/vin/:vin/html', async (req, res) => {
  const { vin } = req.params;
  const apiKey = process.env.CARFAX_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch(`https://panel.cheapcarfax.net/api/carfax/vin/${vin}/html`, {
      headers: {
        'x-api-key': apiKey,
        'Accept': 'application/json',
        'User-Agent': 'Carfax-Proxy/1.0'
      }
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      error: 'Proxy server error',
      details: error.message
    });
  }
});

app.get('/api/reports/:vin', async (req, res) => {
  const { vin } = req.params;
  const apiKey = process.env.CARFAX_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch(`https://panel.cheapcarfax.net/api/reports/${vin}`, {
      headers: {
        'x-api-key': apiKey,
        'Accept': 'application/json',
        'User-Agent': 'Carfax-Proxy/1.0'
      }
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      error: 'Proxy server error',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Carfax Proxy Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
