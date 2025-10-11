// Vercel Serverless Function to generate AI match reports
// This proxies requests to OpenRouter AI to keep API keys server-side

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get match data from request body
  const { matchData } = req.body;

  if (!matchData) {
    return res.status(400).json({ error: 'Match data is required' });
  }

  // Get API key from environment variable
  const apiKey = process.env.OR_API_KEY || process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.error('Missing OpenRouter API key in environment variables');
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
        messages: [
          {
            role: 'system',
            content: 'You are an AI sports writer covering grassroots football. Write short, honest match reports in clear British English. Capture the spirit of the game — the teamwork, graft, and small turning points — without exaggeration or flattery. Celebrate effort, learning, and moments of character as much as results or goals. Keep the tone warm and fair, showing pride in the team as a whole. A parent reading should feel their child\'s part mattered, and the story should sound like it came from the touchline, not a press office.'
          },
          {
            role: 'user',
            content: matchData
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', response.status, errorData);
      return res.status(response.status).json({
        error: 'Failed to generate report',
        details: errorData
      });
    }

    const data = await response.json();

    // Extract the generated report from the response
    const report = data.choices?.[0]?.message?.content;

    if (!report) {
      console.error('No report in response:', data);
      return res.status(500).json({ error: 'No report generated' });
    }

    // Return the report
    return res.status(200).json({ report });

  } catch (error) {
    console.error('Error generating report:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
