/* eslint-disable react/no-danger */
import React from 'react';

export default function Html({ assets, content, initialState, clientConfig }) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=320,initial-scale=1.0" />
        {Object.keys(assets.styles).map((style, i) => (
          <link
            key={i}
            href={assets.styles[style]}
            media="screen, projection"
            rel="stylesheet"
            type="text/css" />
        ))}
      </head>
      <body>
        <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
        <div id="devtools" />
        <script id="initial-state" type="text/plain" data-json={initialState} />
        <script id="client-config" type="text/plain" data-json={clientConfig} />
        {Object.keys(assets.javascript).map((script, i) => (
          <script key={i} src={assets.javascript[script]} charSet="utf-8" />
        ))}
      </body>
    </html>
  );
}
