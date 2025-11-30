export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>OAuth Callback</title>
      </head>
      <body>
        <h1>Redirecting...</h1>
        <script>
          if (window.opener) {
            window.opener.postMessage(window.location.href, "*");
            window.close();
          }
        </script>
      </body>
    </html>
  `;

  res.status(200).send(html);
}
