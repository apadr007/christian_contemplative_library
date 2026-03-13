export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, entryIndex } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  const API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!API_KEY) {
    console.error('ANTHROPIC_API_KEY not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const systemPrompt = `You are the Curator of "The God Who Indwells" — a digital exhibition drawn from the Christian contemplative tradition spanning twenty centuries. Your role is to listen carefully to what a visitor is carrying — a struggle, a question, a season of life — and recommend the most relevant entries from the exhibition.

EXHIBITION INDEX (entry ID, title, category, era, and brief description):
${entryIndex}

CATEGORIES:
- scripture: Sacred Scripture entries
- desert: Desert Fathers & Mothers
- medieval: Medieval Mystics
- carmelite: Carmelite Tradition
- modern: Modern Contemplatives

YOUR TASK:
1. Respond with genuine pastoral attentiveness — acknowledge what the person is experiencing before recommending entries.
2. Recommend 2–4 entries that speak most directly to their situation. Reference them using [ID] notation (e.g. [42]) so they become clickable links.
3. Briefly explain WHY each entry speaks to their specific situation — not just what the entry is about.
4. Keep your tone warm, unhurried, and contemplative — consistent with the exhibition's spirit.
5. End with a gentle invitation to explore or to share more if they wish.

FORMATTING:
- Use **bold** for entry titles and key phrases
- Use *italic* for quotes or especially resonant phrases
- Use [ID] to reference entries (they become clickable links automatically)
- Keep responses to 200–350 words — contemplative, not exhaustive
- Do not use bullet points — write in flowing prose

If the person asks a follow-up question or wants to explore further, continue the conversation naturally, recommending different entries as appropriate.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        system: systemPrompt,
        messages: messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Anthropic API error:', JSON.stringify(data));
      return res.status(502).json({ error: 'Could not reach the AI. Please try again.' });
    }

    const reply = data.content?.[0]?.text;
    if (!reply) {
      return res.status(502).json({ error: 'Empty response from AI.' });
    }

    return res.status(200).json({ reply });

  } catch (err) {
    console.error('Recommend handler error:', err.message);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}
