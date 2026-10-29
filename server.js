const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// স্ট্যাটিক ফাইল হিসেবে আপনার ফ্রন্টএন্ড (index.html ইত্যাদি) পরিবেশন করার জন্য
app.use(express.static(__dirname));

// প্রক্সি রাউটিং: /proxy/ এর পরের অংশটুকু রিমোট URL হিসেবে ধরে ফেচ করবে
app.use('/proxy/*', async (req, res) => {
    try {
        // /proxy/ এর পর থেকে আসল ইউআরএল বের করা
        const targetUrl = req.baseUrl.replace('/proxy/', '') + (req.url === '/' ? '' : req.url);
        
        if (!targetUrl.startsWith('http')) {
            return res.status(400).send('Invalid target URL for proxy.');
        }

        console.log(`[BACKEND PROXY] Fetching: ${targetUrl}`);

        // রিমোট সার্ভারে রিকোয়েস্ট পাঠানো (এখানে চাইলে আপনি DataImpulse বা অন্য প্রক্সি এজেন্ট কনফিগার করতে পারেন)
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: {
                'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
                'Accept': req.headers['accept'] || '*/*'
            },
            body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body)
        });

        // হেডার্স কপি করা
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

// সার্ভার চালু করা
app.listen(PORT, () => {
    console.log(`[SERVER] MegaTasky backend running on port ${PORT}`);
});
