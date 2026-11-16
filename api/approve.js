export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const paymentId = req.body.paymentId || (req.body && req.body.paymentId);
        
        if (!paymentId) {
            return res.status(400).json({ error: 'Missing paymentId' });
        }

        const serverKey = process.env.PI_API_KEY;
        if (!serverKey) {
            return res.status(500).json({ error: 'Server Pi API Key not configured' });
        }

        const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
            method: 'POST',
            headers: {
                'Authorization': `Key ${serverKey}`,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({ error: errorData });
        }

        const payment = await response.json();
        return res.status(200).json(payment);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
