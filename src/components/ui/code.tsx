"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeProps {
  children: string;
  language?: string;
  showLineNumbers?: boolean;
}

export function Code({ children, language = "typescript", showLineNumbers = true }: CodeProps) {
  return (
    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      showLineNumbers={showLineNumbers}
      wrapLongLines={true}
      customStyle={{
        margin: 0,
        borderRadius: "4px",
        background: "#0f0f0f",
        border: "1px solid #1f1f1f",
        fontSize: "0.75rem",
        padding: "1rem",
        overflowX: "auto",
        maxWidth: "100%",
        wordBreak: "break-all",
        whiteSpace: "pre-wrap",
      }}
      codeTagProps={{
        style: {
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
          wordBreak: "break-all",
          whiteSpace: "pre-wrap",
        },
      }}
    >
      {children}
    </SyntaxHighlighter>
  );
}
