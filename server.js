const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// স্ট্যাটিক ফাইল পরিবেশন করার জন্য
app.use(express.static(__dirname));

// রুট রাউট: ব্রাউজারে লিংক ওপেন করলে সরাসরি index.html দেখাবে
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// প্রক্সি রাউটিং
app.use('/proxy/*', async (req, res) => {
    try {
        let targetUrl = req.originalUrl.replace('/proxy/', '');
        
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            targetUrl = 'https://' + targetUrl;
        }

        console.log(`[BACKEND PROXY] Fetching: ${targetUrl}`);

        const response = await fetch(targetUrl, {
            method: req.method,
            headers: {
                'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
                'Accept': req.headers['accept'] || '*/*'
            },
            body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body)
        });

        response.headers.forEach((value, name) => {
            res.setHeader(name, value);
        });

        res.status(response.status);
        const buffer = await response.buffer();
        res.send(buffer);

    } catch (error) {
        console.error('[BACKEND PROXY ERROR]:', error.message);
        res.status(500).send({ error: 'Proxy request failed', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`[SERVER] MegaTasky backend running on port ${PORT}`);
});
