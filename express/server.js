const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post('/generate-image', async (req, res) => {
    try {
        const { prompt, count, resolution } = req.body;

        if (!prompt || !count || !resolution) {
            return res.status(400).json({
                error: 'Missing required parameters',
                details: { required: ['prompt', 'count', 'resolution'] }
            });
        }

        const [width, height] = resolution.split('x').map(Number);
        if (isNaN(width) || isNaN(height)) {
            return res.status(400).json({
                error: 'Invalid resolution format',
                example: '512x512 or 1024x1024'
            });
        }

        const generatedImages = [];
        const errors = [];

        for (let i = 0; i < count; i++) {
            try {
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                         // Add your API key..
                        'Authorization': process.env.API_KEY
                    },
                    body: JSON.stringify({
                        response_image_type: 'png',
                        prompt: prompt,
                        seed: Math.floor(Math.random() * 1000),
                        steps: 23,
                        width: width,
                        height: height,
                        image_num: 1
                    })
                };

                const response = await fetch('https://api.novita.ai/v3beta/flux-1-schnell', options);
                const data = await response.json();

                if (response.ok && data.images?.[0]?.image_url) {
                    generatedImages.push(data.images[0].image_url);
                } else {
                    errors.push({
                        attempt: i + 1,
                        error: data.message || 'Unknown API error',
                        status: response.status
                    });
                }
            } catch (err) {
                errors.push({
                    attempt: i + 1,
                    error: err.message,
                    status: 500
                });
            }
        }

        if (generatedImages.length === 0) {
            throw new Error('All image generation attempts failed');
        }

        res.json({
            success: true,
            images: generatedImages,
            partialErrors: errors.length > 0 ? errors : undefined,
            generatedCount: generatedImages.length,
            failedCount: errors.length
        });

    } catch (error) {
        console.error('Generation error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
});
