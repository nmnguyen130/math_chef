import React, { useState } from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

interface KaTeXInlineProps {
  expression: string;
  fontSize?: number;
}

const KaTeXInline: React.FC<KaTeXInlineProps> = ({
  expression,
  fontSize = 18,
}) => {
  const [height, setHeight] = useState(fontSize * 2);

  // Cập nhật HTML để hỗ trợ render LaTeX và văn bản bình thường
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
        <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
        <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"
          onload="renderMathInElement(document.body, {
            delimiters: [
              {left: '\\\\[', right: '\\\\]', display: true},
              {left: '\\\\(', right: '\\\\)', display: false},
              {left: '$$', right: '$$', display: true},
              {left: '$', right: '$', display: false}
            ],
            throwOnError: false
          });
          setTimeout(() => {
            const height = document.body.scrollHeight;
            window.ReactNativeWebView.postMessage(JSON.stringify({ height }));
          }, 100);
        ">
        </script>
        <style>
          html, body {
            margin: 0;
            padding: 0;
            font-size: ${fontSize}px;
            background: transparent;
            font-family: sans-serif;
          }
          div {
            display: inline;
            line-height: 1.6;
          }
        </style>
      </head>
      <body>
        <div>${expression}</div>
      </body>
    </html>
  `;

  return (
    <View style={{ width: "100%", height: height }}>
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        scrollEnabled={false}
        style={{ backgroundColor: "transparent" }}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            setHeight(data.height);
          } catch (e) {
            console.warn("Failed to parse size message", e);
          }
        }}
      />
    </View>
  );
};

export default KaTeXInline;
