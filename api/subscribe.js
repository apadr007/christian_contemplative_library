export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const API_KEY = process.env.KIT_API_KEY;
  if (!API_KEY) {
    console.error('KIT_API_KEY not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Find or create the tag
    const tagsRes = await fetch(
      `https://api.convertkit.com/v3/tags?api_key=${API_KEY}`
    );
    const tagsData = await tagsRes.json();

    let tagId = tagsData.tags?.find(
      t => t.name === 'Contemplative Exhibition Visitors'
    )?.id;

    if (!tagId) {
      const createRes = await fetch('https://api.convertkit.com/v3/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: API_KEY,
          tag: { name: 'Contemplative Exhibition Visitors' }
        })
      });
      const createData = await createRes.json();
      tagId = createData.id;
    }

    if (!tagId) {
      return res.status(502).json({ error: 'Could not subscribe. Please try again.' });
    }

    // Subscribe to tag with skip_email_confirmation = true (single opt-in)
    const subRes = await fetch(
      `https://api.convertkit.com/v3/tags/${tagId}/subscribe`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: API_KEY,
          email: email,
          skip_email_confirmation: true
        })
      }
    );

    const subData = await subRes.json();

    if (!subRes.ok) {
      console.error('Kit error:', JSON.stringify(subData));
      return res.status(502).json({ error: 'Could not subscribe. Please try again.' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Subscribe error:', err.message);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}
