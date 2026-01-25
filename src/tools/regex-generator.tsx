"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToolConfig } from "@/types/tool";

interface CommonPattern {
  name: string;
  pattern: string;
  description: string;
}

const commonPatterns: CommonPattern[] = [
  { name: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", description: "Matches standard email addresses" },
  { name: "Phone (US)", pattern: "\\(?\\d{3}\\)?[-\\s]?\\d{3}[-\\s]?\\d{4}", description: "Matches US phone numbers like (123) 456-7890" },
  { name: "URL", pattern: "https?:\\/\\/[\\w\\-\\.]+\\.[a-zA-Z]{2,}(\\/[\\w\\-\\.\\/\\?\\=\\&\\%]*)?", description: "Matches HTTP/HTTPS URLs" },
  { name: "IPv4 Address", pattern: "\\b(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\b", description: "Matches valid IPv4 addresses" },
  { name: "IPv6 Address", pattern: "([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}", description: "Matches IPv6 addresses (full format)" },
  { name: "Date (YYYY-MM-DD)", pattern: "\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])", description: "Matches ISO date format" },
  { name: "Date (MM/DD/YYYY)", pattern: "(?:0[1-9]|1[0-2])\\/(?:0[1-9]|[12]\\d|3[01])\\/\\d{4}", description: "Matches US date format" },
  { name: "Time (24h)", pattern: "(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d)?", description: "Matches 24-hour time format" },
  { name: "Credit Card", pattern: "\\b(?:\\d{4}[- ]?){3}\\d{4}\\b", description: "Matches credit card numbers" },
  { name: "Hex Color", pattern: "#(?:[0-9a-fA-F]{3}){1,2}\\b", description: "Matches hex color codes" },
  { name: "Username", pattern: "[a-zA-Z][a-zA-Z0-9_]{2,15}", description: "Matches usernames (3-16 chars, alphanumeric)" },
  { name: "Password (Strong)", pattern: "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}", description: "At least 8 chars with upper, lower, number, special" },
  { name: "Slug", pattern: "[a-z0-9]+(?:-[a-z0-9]+)*", description: "Matches URL slugs" },
  { name: "HTML Tag", pattern: "<([a-z]+)([^<]+)*(?:>(.*)<\\/\\1>|\\s+\\/>)", description: "Matches HTML tags" },
  { name: "ZIP Code (US)", pattern: "\\b\\d{5}(?:-\\d{4})?\\b", description: "Matches US ZIP codes" },
];

function explainRegex(pattern: string): string[] {
  const explanations: string[] = [];

  const tokens: { pattern: RegExp; explain: (match: string) => string }[] = [
    { pattern: /^\^/, explain: () => "^ - Start of string/line" },
    { pattern: /\$$/, explain: () => "$ - End of string/line" },
    { pattern: /\\d/, explain: () => "\\d - Any digit (0-9)" },
    { pattern: /\\D/, explain: () => "\\D - Any non-digit" },
    { pattern: /\\w/, explain: () => "\\w - Any word character (a-z, A-Z, 0-9, _)" },
    { pattern: /\\W/, explain: () => "\\W - Any non-word character" },
    { pattern: /\\s/, explain: () => "\\s - Any whitespace character" },
    { pattern: /\\S/, explain: () => "\\S - Any non-whitespace character" },
    { pattern: /\\b/, explain: () => "\\b - Word boundary" },
    { pattern: /\\B/, explain: () => "\\B - Non-word boundary" },
    { pattern: /\./, explain: () => ". - Any character except newline" },
    { pattern: /\+/, explain: () => "+ - One or more of the preceding" },
    { pattern: /\*/, explain: () => "* - Zero or more of the preceding" },
    { pattern: /\?/, explain: () => "? - Zero or one of the preceding (optional)" },
    { pattern: /\{(\d+)\}/, explain: (m) => `{n} - Exactly ${m.match(/\d+/)?.[0]} occurrences` },
    { pattern: /\{(\d+),\}/, explain: (m) => `{n,} - ${m.match(/\d+/)?.[0]} or more occurrences` },
    { pattern: /\{(\d+),(\d+)\}/, explain: (m) => { const nums = m.match(/\d+/g); return `{n,m} - Between ${nums?.[0]} and ${nums?.[1]} occurrences`; } },
    { pattern: /\[([^\]]+)\]/, explain: (m) => `[...] - Character class: matches any of ${m.slice(1, -1)}` },
    { pattern: /\[^([^\]]+)\]/, explain: (m) => `[^...] - Negated character class: matches any except ${m.slice(2, -1)}` },
    { pattern: /\(([^)]+)\)/, explain: () => "(...) - Capturing group" },
    { pattern: /\(\?:([^)]+)\)/, explain: () => "(?:...) - Non-capturing group" },
    { pattern: /\(\?=([^)]+)\)/, explain: () => "(?=...) - Positive lookahead" },
    { pattern: /\(\?!([^)]+)\)/, explain: () => "(?!...) - Negative lookahead" },
    { pattern: /\|/, explain: () => "| - Alternation (OR)" },
  ];

  for (const token of tokens) {
    if (token.pattern.test(pattern)) {
      const match = pattern.match(token.pattern);
      if (match) {
        explanations.push(token.explain(match[0]));
      }
    }
  }

  if (explanations.length === 0) {
    explanations.push("This pattern matches literal characters");
  }

  return explanations;
}

export function RegexGeneratorTool() {
  const [description, setDescription] = useState("");
  const [generatedPattern, setGeneratedPattern] = useState("");
  const [explanation, setExplanation] = useState<string[]>([]);
  const [testString, setTestString] = useState("");
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleSelectPattern = (pattern: CommonPattern) => {
    setGeneratedPattern(pattern.pattern);
    setExplanation(explainRegex(pattern.pattern));
    setError("");
  };

  const handleGenerateFromDescription = () => {
    if (!description.trim()) {
      setError("Please enter a description");
      return;
    }

    const desc = description.toLowerCase();
    let pattern = "";

    if (desc.includes("email")) {
      pattern = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}";
    } else if (desc.includes("phone") || desc.includes("telephone")) {
      pattern = "\\(?\\d{3}\\)?[-\\s]?\\d{3}[-\\s]?\\d{4}";
    } else if (desc.includes("url") || desc.includes("link") || desc.includes("website")) {
      pattern = "https?:\\/\\/[\\w\\-\\.]+\\.[a-zA-Z]{2,}(\\/[\\w\\-\\.\\/\\?\\=\\&\\%]*)?";
    } else if (desc.includes("ip") && desc.includes("v6")) {
      pattern = "([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}";
    } else if (desc.includes("ip") || desc.includes("ipv4")) {
      pattern = "\\b(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\b";
    } else if (desc.includes("date") && (desc.includes("iso") || desc.includes("yyyy"))) {
      pattern = "\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])";
    } else if (desc.includes("date")) {
      pattern = "(?:0[1-9]|1[0-2])\\/(?:0[1-9]|[12]\\d|3[01])\\/\\d{4}";
    } else if (desc.includes("time")) {
      pattern = "(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d)?";
    } else if (desc.includes("hex") || desc.includes("color")) {
      pattern = "#(?:[0-9a-fA-F]{3}){1,2}\\b";
    } else if (desc.includes("credit") || desc.includes("card")) {
      pattern = "\\b(?:\\d{4}[- ]?){3}\\d{4}\\b";
    } else if (desc.includes("zip") || desc.includes("postal")) {
      pattern = "\\b\\d{5}(?:-\\d{4})?\\b";
    } else if (desc.includes("username")) {
      pattern = "[a-zA-Z][a-zA-Z0-9_]{2,15}";
    } else if (desc.includes("password")) {
      pattern = "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}";
    } else if (desc.includes("number") || desc.includes("digit")) {
      pattern = "\\d+";
    } else if (desc.includes("word")) {
      pattern = "\\w+";
    } else if (desc.includes("slug")) {
      pattern = "[a-z0-9]+(?:-[a-z0-9]+)*";
    } else if (desc.includes("html") || desc.includes("tag")) {
      pattern = "<([a-z]+)([^<]+)*(?:>(.*)<\\/\\1>|\\s+\\/>)";
    } else {
      setError("Could not generate pattern from description. Try selecting a common pattern below.");
      return;
    }

    setGeneratedPattern(pattern);
    setExplanation(explainRegex(pattern));
    setError("");
  };

  const handleTestPattern = () => {
    if (!generatedPattern || !testString) {
      setMatches([]);
      return;
    }

    try {
      const regex = new RegExp(generatedPattern, "g");
      const found = testString.match(regex) || [];
      setMatches(found);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid regex pattern");
      setMatches([]);
    }
  };

  const handleReset = () => {
    setDescription("");
    setGeneratedPattern("");
    setExplanation([]);
    setTestString("");
    setMatches([]);
    setError("");
  };

  return (
    <div className="space-y-6">
      {/* Description Input */}
      <div>
        <Label className="mb-2 block text-sm">Describe what you want to match</Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., email address, phone number, URL, date..."
          className="text-sm"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={handleGenerateFromDescription} variant="primary" className="flex-1">
          Generate Regex
        </Button>
        <Button onClick={handleReset} className="sm:flex-none">
          Reset
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-[var(--color-red-50)] border border-[var(--color-red-200)] rounded-[12px] text-[var(--color-red-500)] text-sm">
          {error}
        </div>
      )}

      {/* Common Patterns */}
      <div>
        <Label className="mb-2 block text-sm">Or select a common pattern</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto p-1">
          {commonPatterns.map((p) => (
            <button
              key={p.name}
              onClick={() => handleSelectPattern(p)}
              className="text-left p-2 text-xs rounded-[8px] border border-[var(--color-gray-200)] hover:border-[var(--color-blue-500)] hover:bg-[var(--color-blue-50)] transition-colors cursor-pointer"
              title={p.description}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Generated Pattern */}
      {generatedPattern && (
        <>
          <Input
            label="Generated Regex Pattern"
            value={generatedPattern}
            readOnly
            showCopy
            className="font-mono text-sm bg-[var(--color-gray-0)]"
          />

          {/* Explanation */}
          {explanation.length > 0 && (
            <div>
              <Label className="mb-2 block text-sm">Pattern Explanation</Label>
              <div className="p-3 bg-[var(--color-gray-0)] border border-[var(--color-gray-200)] rounded-[12px] space-y-1">
                {explanation.map((exp, i) => (
                  <div key={i} className="text-sm font-mono text-[var(--color-gray-600)]">
                    {exp}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Test Section */}
          <div>
            <Label className="mb-2 block text-sm">Test String</Label>
            <Textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter text to test the pattern..."
              className="min-h-[100px]"
            />
          </div>

          <Button onClick={handleTestPattern} variant="primary" className="w-full">
            Test Pattern
          </Button>

          {/* Test Results */}
          {matches.length > 0 && (
            <div>
              <Label className="mb-2 block text-sm">Matches ({matches.length})</Label>
              <div className="p-3 bg-[var(--color-gray-0)] border border-[var(--color-gray-200)] rounded-[12px] space-y-1 max-h-[200px] overflow-y-auto">
                {matches.map((match, i) => (
                  <div key={i} className="text-sm font-mono text-[var(--color-green-500)]">
                    {i + 1}. &quot;{match}&quot;
                  </div>
                ))}
              </div>
            </div>
          )}

          {testString && matches.length === 0 && !error && (
            <div className="p-3 rounded-[12px] border bg-yellow-500/10 border-yellow-500/30 text-yellow-600">
              <div className="text-sm font-medium">No matches found</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export const regexGeneratorConfig: ToolConfig = {
  id: "regex-generator",
  name: "Regex Generator",
  description: "Generate regular expressions from descriptions and common patterns",
  category: "generators",
  component: RegexGeneratorTool,
  seo: {
    keywords: [
      "regex generator",
      "regular expression generator",
      "regex builder",
      "regex creator",
      "generate regex",
      "regex from text",
      "regex pattern generator",
      "regex maker",
      "create regex",
      "regex helper",
      "regex explainer",
      "common regex patterns",
    ],
  },
  sections: [
    {
      title: "What is a Regex Generator?",
      content:
        "A regex generator helps you create regular expressions without memorizing complex syntax. Simply describe what you want to match or select from common patterns, and the tool generates the appropriate regex for you.",
    },
    {
      title: "How does it work?",
      content: (
        <>
          <p className="text-sm mb-4">
            This tool provides two ways to generate regex patterns: by description or by selecting common patterns. When you describe what you want to match, it analyzes your description and suggests an appropriate pattern. The tool also explains each part of the generated regex to help you understand how it works.
          </p>

          <h4 className="text-base font-semibold mb-2">Common Use Cases</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Validating email addresses, phone numbers, URLs</li>
            <li>Extracting dates, times, IP addresses from text</li>
            <li>Matching patterns in log files or data</li>
            <li>Form input validation</li>
            <li>Search and replace operations</li>
          </ul>
        </>
      ),
    },
  ],
  examples: [
    {
      title: "Email validation",
      content: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
      type: "code",
    },
    {
      title: "US Phone number",
      content: "\\(?\\d{3}\\)?[-\\s]?\\d{3}[-\\s]?\\d{4}",
      type: "code",
    },
    {
      title: "IPv4 Address",
      content: "\\b(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\b",
      type: "code",
    },
  ],
  codeSnippet: `// No external dependencies needed - uses built-in RegExp

interface RegexPattern {
  pattern: string;
  description: string;
}

// Common regex patterns library
const patterns: Record<string, RegexPattern> = {
  email: {
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}',
    description: 'Matches standard email addresses'
  },
  phone: {
    pattern: '\\\\(?\\\\d{3}\\\\)?[-\\\\s]?\\\\d{3}[-\\\\s]?\\\\d{4}',
    description: 'Matches US phone numbers'
  },
  url: {
    pattern: 'https?:\\\\/\\\\/[\\\\w\\\\-\\\\.]+\\\\.[a-zA-Z]{2,}',
    description: 'Matches HTTP/HTTPS URLs'
  },
  ipv4: {
    pattern: '\\\\b(?:(?:25[0-5]|2[0-4]\\\\d|[01]?\\\\d\\\\d?)\\\\.){3}(?:25[0-5]|2[0-4]\\\\d|[01]?\\\\d\\\\d?)\\\\b',
    description: 'Matches IPv4 addresses'
  },
  date: {
    pattern: '\\\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\\\d|3[01])',
    description: 'Matches ISO date format (YYYY-MM-DD)'
  }
};

function getPattern(type: string): RegexPattern | null {
  return patterns[type] || null;
}

function testPattern(pattern: string, text: string): string[] {
  try {
    const regex = new RegExp(pattern, 'g');
    return text.match(regex) || [];
  } catch {
    return [];
  }
}

function validatePattern(pattern: string): boolean {
  try {
    new RegExp(pattern);
    return true;
  } catch {
    return false;
  }
}

// Example usage
const emailPattern = getPattern('email');
if (emailPattern) {
  console.log('Email Pattern:', emailPattern.pattern);
  console.log('Description:', emailPattern.description);

  const testText = 'Contact us at hello@example.com or support@test.org';
  const matches = testPattern(emailPattern.pattern, testText);
  console.log('Matches:', matches);
}

// Output:
// Email Pattern: [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}
// Description: Matches standard email addresses
// Matches: ['hello@example.com', 'support@test.org']`,
  references: [
    {
      title: "MDN: Regular Expressions",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions",
    },
    {
      title: "RegExr - Learn, Build & Test RegEx",
      url: "https://regexr.com/",
    },
  ],
};
