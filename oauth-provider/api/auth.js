export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { code, provider } = req.query;

  const {
    OAUTH_CLIENT_ID: clientId,
    OAUTH_CLIENT_SECRET: clientSecret,
  } = process.env;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'OAuth credentials not configured' });
  }

  // If no code, redirect to GitHub OAuth
  if (!code) {
    const redirectUri = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}/api/auth`;
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo`;

    return res.redirect(authUrl);
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
    const message = {
      token: data.access_token,
      provider: provider || 'github',
    };

    const html = `
      <!DOCTYPE html>
      <html>
      <head><title>Success!</title></head>
      <body>
      <p>Authorization successful! This window should close automatically...</p>
      <script>
        (function() {
          const message = ${JSON.stringify(message)};

          // Post message to opener
          if (window.opener) {
            window.opener.postMessage(
              'authorization:github:success:' + JSON.stringify(message),
              '*'
            );

            // Close window after a short delay
            setTimeout(function() {
              window.close();
            }, 1000);
          } else {
            document.body.innerHTML = '<p>Please close this window and return to the CMS.</p>';
          }
        })();
      </script>
      </body>
      </html>
    `;

    res.status(200).send(html);
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).json({ error: error.message });
  }
}
