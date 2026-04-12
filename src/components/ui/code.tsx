"use client";

import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  materialLight,
  materialOceanic,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { MdContentCopy, MdCheck, MdExpandMore, MdExpandLess } from "react-icons/md";

interface CodeProps {
  children: string;
  framed?: boolean;
  language?: string;
  showLineNumbers?: boolean;
  showCopy?: boolean;
}

export function Code({
  children,
  language = "",
  showLineNumbers = true,
  showCopy = false,
  framed = true,
}: CodeProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const lines = children.split('\n');
  const shouldCollapse = lines.length > 10;
  const displayContent = shouldCollapse && !isExpanded
    ? lines.slice(0, 10).join('\n')
    : children;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      {/* Language Badge */}
      {language !== "" && (
        <div className="absolute top-2 left-2 z-10 px-2 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-gray-500)] bg-[var(--color-gray-0)]">
          {language}
        </div>
      )}

      {/* Copy Button */}
      {showCopy && (
        <button
          type="button"
          onClick={handleCopy}
          className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center border border-[var(--color-gray-200)] bg-[var(--color-gray-0)] transition-colors cursor-pointer hover:bg-[var(--color-yellow-50)]"
          title={copied ? "Copied!" : "Copy to clipboard"}
        >
          {copied ? (
            <MdCheck style={{ width: 16, height: 16, color: 'var(--color-green-500)' }} />
          ) : (
            <MdContentCopy style={{ width: 16, height: 16 }} />
          )}
        </button>
      )}

      <SyntaxHighlighter
        language={language}
        style={isDark ? materialOceanic : materialLight}
        showLineNumbers={showLineNumbers}
        wrapLongLines={false}
        customStyle={{
          margin: 0,
          borderRadius: "0",
          background: "var(--color-gray-0)",
          border: framed ? "1px solid var(--color-gray-200)" : "0",
          fontSize: "0.8125rem",
          padding: "0.75rem",
          paddingTop: language !== "" || showCopy ? "2.5rem" : "0.75rem",
          overflowX: "auto",
          maxWidth: "100%",
        }}
        codeTagProps={{
          style: {
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
          },
        }}
      >
        {displayContent}
      </SyntaxHighlighter>

      {/* View More/Less Button */}
      {shouldCollapse && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 text-sm font-medium text-[var(--color-gray-500)] bg-[var(--color-gray-0)] hover:bg-[var(--color-gray-50)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          style={{
            borderLeft: framed ? "1px solid var(--color-gray-200)" : "0",
            borderRight: framed ? "1px solid var(--color-gray-200)" : "0",
            borderBottom: framed ? "1px solid var(--color-gray-200)" : "0",
            borderTop: "0",
          }}
        >
          {isExpanded ? (
            <>
              <MdExpandLess className="w-4 h-4" />
              <span>View Less</span>
            </>
          ) : (
            <>
              <MdExpandMore className="w-4 h-4" />
              <span>View More ({lines.length - 10} more lines)</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
