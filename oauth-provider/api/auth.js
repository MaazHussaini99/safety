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
    const token = data.access_token;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authorizing...</title>
  <script>
    (function() {
      console.log("OAuth callback page loaded");
      console.log("window.opener exists:", !!window.opener);

      if (!window.opener) {
        document.body.innerHTML = '<p>Error: No parent window found. Please close this window.</p>';
        return;
      }

      var messageSent = false;

      function receiveMessage(e) {
        console.log("Received message from CMS:", e.data, "from origin:", e.origin);

        if (!messageSent) {
          messageSent = true;
          // Reply to the CMS
          var response = 'authorization:github:success:{"token":"${token}","provider":"github"}';
          console.log("Sending response:", response);
          window.opener.postMessage(response, e.origin);

          // Close window after sending
          setTimeout(function() {
            window.close();
          }, 1000);
        }
      }

      window.addEventListener("message", receiveMessage, false);

      // Notify the CMS that we're ready
      console.log("Notifying parent window with 'authorizing:github'");
      window.opener.postMessage("authorizing:github", "*");

      // Fallback: close window after 5 seconds if no response
      setTimeout(function() {
        console.log("Timeout reached, closing window");
        window.close();
      }, 5000);
    })();
  </script>
</head>
<body>
  <p>Authorized! This window should close automatically...</p>
  <p><small>If it doesn't close, you can close it manually.</small></p>
</body>
</html>
    `;

    res.status(200).send(html);
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).json({ error: error.message });
  }
}
