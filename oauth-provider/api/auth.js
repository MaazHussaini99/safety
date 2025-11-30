export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Missing code parameter' });
  }

  const {
    OAUTH_CLIENT_ID: clientId,
    OAUTH_CLIENT_SECRET: clientSecret,
  } = process.env;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'OAuth credentials not configured' });
  }

  try {
    // Exchange code for token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const data = await tokenResponse.json();

    if (data.error) {
      return res.status(400).json({ error: data.error_description || data.error });
    }

    // Return HTML that posts message to parent window
    const content = {
      token: data.access_token,
      provider: 'github',
    };

    const script = `
      <script>
        (function() {
          function receiveMessage(e) {
            console.log("receiveMessage %o", e);
            window.opener.postMessage(
              'authorization:github:success:${JSON.stringify(content)}',
              e.origin
            );
            window.removeEventListener("message", receiveMessage, false);
          }
          window.addEventListener("message", receiveMessage, false);
          console.log("Sending message: %o", "authorizing:github");
          window.opener.postMessage("authorizing:github", "*");
        })();
      </script>
    `;

    res.status(200).send(script);
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).json({ error: error.message });
  }
}
