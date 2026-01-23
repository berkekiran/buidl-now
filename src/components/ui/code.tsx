"use client";

import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight, oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { MdContentCopy, MdCheck, MdExpandMore, MdExpandLess } from "react-icons/md";

interface CodeProps {
  children: string;
  language?: string;
  showLineNumbers?: boolean;
  showCopy?: boolean;
}

export function Code({ children, language = "", showLineNumbers = true, showCopy = false }: CodeProps) {
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
        <div className="absolute top-3 left-3 z-10 px-2.5 py-1 text-xs font-medium text-[var(--color-gray-400)] bg-[var(--color-gray-0)] rounded-lg">
          {language}
        </div>
      )}

      {/* Copy Button */}
      {showCopy && (
        <button
          type="button"
          onClick={handleCopy}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-[var(--color-gray-0)] border border-[var(--color-gray-200)] hover:bg-[var(--color-gray-50)] flex items-center justify-center transition-colors cursor-pointer"
          title={copied ? "Copied!" : "Copy to clipboard"}
        >
          {copied ? (
            <MdCheck style={{ width: 18, height: 18, color: 'var(--color-green-500)' }} />
          ) : (
            <MdContentCopy style={{ width: 18, height: 18 }} />
          )}
        </button>
      )}

      <SyntaxHighlighter
        language={language}
        style={isDark ? oneDark : oneLight}
        showLineNumbers={showLineNumbers}
        wrapLongLines={false}
        customStyle={{
          margin: 0,
          borderRadius: shouldCollapse ? "12px 12px 0 0" : "12px",
          background: "var(--color-gray-0)",
          border: "1px solid var(--color-gray-200)",
          fontSize: "0.8125rem",
          padding: "1rem",
          paddingTop: language !== "" || showCopy ? "3rem" : "1rem",
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
          className="w-full px-4 py-3 text-sm font-medium text-[var(--color-gray-500)] bg-[var(--color-gray-0)] hover:bg-[var(--color-gray-50)] border border-t-0 border-[var(--color-gray-200)] rounded-b-[12px] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
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
