export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  // Basic validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const API_KEY = process.env.KIT_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Step 1: Subscribe the email to Kit
    const subscribeRes = await fetch('https://api.convertkit.com/v3/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: API_KEY,
        email,
        tags: ['Contemplative Exhibition Visitors']
      })
    });

    // Kit returns 200 for new subscribers and existing ones
    if (!subscribeRes.ok) {
      const err = await subscribeRes.json();
      console.error('Kit API error:', err);
      return res.status(502).json({ error: 'Could not subscribe. Please try again.' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}
