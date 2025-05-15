import React, { useState, useRef, useEffect } from "react";
import { View, type ViewStyle } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";

interface KaTeXInlineProps {
  expression: string;
  fontSize?: number;
}

const KaTeXInline: React.FC<KaTeXInlineProps> = ({
  expression,
  fontSize = 18,
}) => {
  const [height, setHeight] = useState<number | null>(null);
  const [webViewHeight, setWebViewHeight] = useState<number>(fontSize * 1.6);
  const viewRef = useRef<View>(null);

  // Check if the expression contains display mode delimiters
  const isDisplayMode = expression.includes("\\[") || expression.includes("$$");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
        <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
        <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
        <script>
          // Store the original expression for later use
          const originalExpression = ${JSON.stringify(expression)};
          
          function initKaTeX() {
            // Only initialize KaTeX if it's not already initialized
            if (window.katex) {
              renderMath();
            } else {
              // Load KaTeX if not loaded
              const script = document.createElement('script');
              script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js';
              script.onload = renderMath;
              document.head.appendChild(script);
            }
          }
          
          function renderMath() {
            renderMathInElement(document.body, {
              delimiters: [
                {left: '\\\\[', right: '\\\\]', display: true},
                {left: '\\\\(', right: '\\\\)', display: false},
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
              ],
              throwOnError: false,
              strict: false
            });
            
            // Update height after rendering
            updateHeight();
          }
          
          // Function to calculate and send the height
          function updateHeight() {
            // Use getBoundingClientRect for more accurate dimensions
            const content = document.getElementById('content');
            if (!content) return;
            
            const rect = content.getBoundingClientRect();
            const height = Math.ceil(rect.height);
            
            // Only update if height is valid and greater than 0
            if (height > 0) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ height }));
            }
          }
          
          // Initialize when DOM is loaded
          document.addEventListener('DOMContentLoaded', initKaTeX);
          
          // Update height when fonts are loaded
          document.fonts.ready.then(() => {
            setTimeout(updateHeight, 0);
          });
          
          // Update height after a short delay to ensure rendering is complete
          setTimeout(updateHeight, 100);
        </script>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body {
            width: 100%;
            min-height: 100%;
            font-size: ${fontSize}px;
            background: transparent;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            -webkit-font-smoothing: antialiased;
            line-height: 1.6;
          }
          #content {
            display: inline-block;
            width: 100%;
            font-size: 1em;
            line-height: 1.6;
            padding: 0;
          }
          .katex {
            font-size: 1em !important;
          }
          .katex-display {
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body style="width: 100%;">
        <div id="content">${expression}</div>
      </body>
    </html>
  `;

  useEffect(() => {
    if (webViewHeight > 0) {
      setHeight(webViewHeight);
    }
  }, [webViewHeight]);

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.height && data.height > 0) {
        setWebViewHeight((prev) => Math.max(prev, data.height));
      }
    } catch (e) {
      console.warn("Failed to parse size message", e);
    }
  };

  // Calculate container height based on content
  const containerHeight = height ?? webViewHeight;

  // Use flex for display mode, auto for inline mode
  const containerStyle: ViewStyle = {
    width: "100%",
    backgroundColor: "transparent",
  };

  if (isDisplayMode) {
    containerStyle.minHeight = containerHeight;
    containerStyle.justifyContent = "center";
  } else {
    // For inline mode, use auto height
    containerStyle.height = containerHeight > 0 ? containerHeight : undefined;
  }

  return (
    <View ref={viewRef} style={containerStyle}>
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        scrollEnabled={false}
        style={{
          backgroundColor: "transparent",
          ...(isDisplayMode
            ? {
                minHeight: containerHeight,
                flex: 1,
              }
            : {
                height: containerHeight,
              }),
          opacity: height ? 1 : 0, // Hide until height is calculated
        }}
        onMessage={handleMessage}
        onContentProcessDidTerminate={() => {
          // Reset height if WebView crashes
          setWebViewHeight(fontSize * 1.6);
        }}
      />
    </View>
  );
};

export default KaTeXInline;
