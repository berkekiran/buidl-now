"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import CryptoJS from "crypto-js";
import { ToolConfig } from "@/types/tool";

type HashAlgorithm = "MD5" | "SHA-1" | "SHA-256" | "SHA-512";

export function HashGeneratorTool() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<HashAlgorithm, string>>({
    "MD5": "",
    "SHA-1": "",
    "SHA-256": "",
    "SHA-512": "",
  });

  const generateHashes = (text: string) => {
    if (!text) {
      setHashes({
        "MD5": "",
        "SHA-1": "",
        "SHA-256": "",
        "SHA-512": "",
      });
      return;
    }

    setHashes({
      "MD5": CryptoJS.MD5(text).toString(),
      "SHA-1": CryptoJS.SHA1(text).toString(),
      "SHA-256": CryptoJS.SHA256(text).toString(),
      "SHA-512": CryptoJS.SHA512(text).toString(),
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    generateHashes(value);
  };

  const handleReset = () => {
    setInput("");
    setHashes({
      "MD5": "",
      "SHA-1": "",
      "SHA-256": "",
      "SHA-512": "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div>
        <Label className="mb-2 block text-sm">Input Text</Label>
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Enter text to hash..."
          rows={8}
          className="text-sm mb-2"
        />
        <div className="flex gap-2">
          <Button onClick={() => generateHashes(input)} className="flex-1">
            Generate
          </Button>
          <Button onClick={handleReset} variant="secondary">
            Reset
          </Button>
        </div>
      </div>

      {/* Output Section */}
      <div>
        <Label className="mb-2 block text-sm">Hashes</Label>
        <div className="space-y-3">
          {(Object.keys(hashes) as HashAlgorithm[]).map((algorithm) => (
            <Input
              key={algorithm}
              label={algorithm}
              value={hashes[algorithm]}
              readOnly
              showCopy
              className="font-mono text-xs bg-[#0f0f0f]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export const hashGeneratorConfig: ToolConfig = {
  id: "hash-generator",
  name: "Hash / Checksum Generator",
  description:
    "Generate cryptographic hashes and checksums (MD5, SHA-1, SHA-256, SHA-512)",
  category: "generators",
  component: HashGeneratorTool,
  sections: [
    {
      title: "What are cryptographic hashes?",
      content:
        "Cryptographic hash functions are mathematical algorithms that convert an input of any length into a fixed-size string of bytes. They are designed to be one-way functions, making it computationally infeasible to reverse.",
    },
    {
      title: "How does it work?",
      content: (
        <>
          <p className="text-sm mb-4">
            Hash algorithms process input data through a series of mathematical operations that scramble and compress it into a fixed-length output. The same input always produces the same hash, but even tiny changes to the input create completely different hashes. This deterministic yet chaotic behavior makes hashes perfect for verifying data integrity, password storage, and digital signatures. Modern algorithms like SHA-256 use complex bitwise operations to ensure the hash cannot be reversed to reveal the original input.
          </p>

          <h4 className="text-base font-semibold mb-2">Hash algorithms</h4>
          <p className="text-sm">
            This tool supports MD5, SHA-1, SHA-256, and SHA-512. MD5 and SHA-1 are older and considered insecure for cryptographic purposes. SHA-256 and SHA-512 are part of the SHA-2 family and are currently considered secure.
          </p>
        </>
      ),
    },
  ],
  examples: [
    {
      title: "Hash a simple string",
      content: `Hello, World!
→ dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f
  (SHA-256)`,
      type: "code",
    },
    {
      title: "Password hashing",
      content: "Use SHA-256 or SHA-512 for stronger password hashing",
      type: "text",
    },
    {
      title: "File integrity verification",
      content: "Compare generated hash with official checksums to verify file integrity",
      type: "text",
    },
  ],
  references: [
    {
      title: "Wikipedia: Cryptographic hash function",
      url: "https://en.wikipedia.org/wiki/Cryptographic_hash_function",
    },
    {
      title: "NIST: Secure Hashing",
      url: "https://csrc.nist.gov/projects/hash-functions",
    },
  ],
};
