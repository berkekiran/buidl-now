"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToolConfig } from "@/types/tool";

function generateUUIDv4(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function UuidGeneratorTool() {
  const [uuid, setUuid] = useState("");
  const [count, setCount] = useState("1");
  const [uuids, setUuids] = useState<string[]>([]);

  const handleGenerate = () => {
    const num = parseInt(count) || 1;
    const limited = Math.min(Math.max(num, 1), 100);

    if (limited === 1) {
      const newUuid = generateUUIDv4();
      setUuid(newUuid);
      setUuids([]);
    } else {
      const newUuids = Array.from({ length: limited }, () => generateUUIDv4());
      setUuids(newUuids);
      setUuid("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Count Input */}
      <div>
        <Label className="mb-2 block text-sm">Number of UUIDs (1-100)</Label>
        <Input
          type="number"
          min="1"
          max="100"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          placeholder="1"
          className="mb-2"
        />
        <Button onClick={handleGenerate} className="w-full">
          Generate UUID{parseInt(count) > 1 ? "s" : ""}
        </Button>
      </div>

      {/* Single UUID Output */}
      {uuid && (
        <Input
          label="Generated UUID (v4)"
          value={uuid}
          readOnly
          showCopy
          className="font-mono text-sm bg-[#0f0f0f]"
        />
      )}

      {/* Multiple UUIDs Output */}
      {uuids.length > 0 && (
        <Textarea
          label={`Generated UUIDs (${uuids.length})`}
          value={uuids.join("\n")}
          readOnly
          showCopy
          className="font-mono text-sm bg-[#0f0f0f]"
          rows={Math.min(uuids.length, 15)}
        />
      )}
    </div>
  );
}

export const uuidGeneratorConfig: ToolConfig = {
  id: "uuid-generator",
  name: "UUID Generator",
  description: "Generate UUIDs (Universally Unique Identifiers)",
  category: "generators",
  component: UuidGeneratorTool,
  seo: {
    keywords: [
      "uuid generator",
      "generate uuid",
      "uuid v4",
      "unique id generator",
      "guid generator",
      "universally unique identifier",
      "random uuid",
      "uuid online",
      "bulk uuid generator",
      "uuid tool",
    ],
  },
  sections: [
    {
      title: "What is a UUID?",
      content:
        "A UUID (Universally Unique Identifier) is a 128-bit number used to uniquely identify information. They are commonly used in distributed systems and databases.",
    },
    {
      title: "How does it work?",
      content: (
        <>
          <h4 className="text-base font-semibold mb-2">UUID v4 (Random)</h4>
          <p className="text-sm mb-4">Version 4 UUIDs are randomly generated. The probability of generating duplicate UUIDs is extremely low - approximately 1 in 5.3×10³⁶ (5.3 undecillion).</p>

          <h4 className="text-base font-semibold mb-2">Format</h4>
          <p className="text-sm">UUIDs are typically displayed as 32 hexadecimal digits, displayed in 5 groups separated by hyphens: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx</p>
        </>
      ),
    },
  ],
  examples: [
    {
      title: "Example UUID v4",
      content: "550e8400-e29b-41d4-a716-446655440000",
      type: "code",
    },
    {
      title: "Another example",
      content: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      type: "code",
    },
  ],
  references: [
    {
      title: "RFC 4122: UUID Specification",
      url: "https://tools.ietf.org/html/rfc4122",
    },
    {
      title: "UUID - Wikipedia",
      url: "https://en.wikipedia.org/wiki/Universally_unique_identifier",
    },
  ],
};
