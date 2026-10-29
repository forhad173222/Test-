// প্রক্সি রাউটিং আপডেট ভার্সন
app.use('/proxy/*', async (req, res) => {
    try {
        let targetUrl = req.originalUrl.replace('/proxy/', '');
        
        // যদি ইউআরএলে http বা https না থাকে, তবে https:// যুক্ত করে দেওয়া
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
