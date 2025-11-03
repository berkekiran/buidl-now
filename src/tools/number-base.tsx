"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToolConfig } from "@/types/tool";

export function NumberBaseTool() {
  const [decimal, setDecimal] = useState("");
  const [binary, setBinary] = useState("");
  const [octal, setOctal] = useState("");
  const [hexadecimal, setHexadecimal] = useState("");

  const updateAllFromDecimal = (value: string) => {
    if (!value || value === "0") {
      setDecimal("0");
      setBinary("0");
      setOctal("0");
      setHexadecimal("0");
      return;
    }

    try {
      const num = parseInt(value, 10);
      if (isNaN(num) || num < 0) return;

      setDecimal(num.toString(10));
      setBinary(num.toString(2));
      setOctal(num.toString(8));
      setHexadecimal(num.toString(16).toUpperCase());
    } catch (e) {
      // Invalid input
    }
  };

  const updateAllFromBinary = (value: string) => {
    if (!value || value === "0") {
      setDecimal("0");
      setBinary("0");
      setOctal("0");
      setHexadecimal("0");
      return;
    }

    try {
      const num = parseInt(value, 2);
      if (isNaN(num)) return;

      setDecimal(num.toString(10));
      setBinary(value);
      setOctal(num.toString(8));
      setHexadecimal(num.toString(16).toUpperCase());
    } catch (e) {
      // Invalid input
    }
  };

  const updateAllFromOctal = (value: string) => {
    if (!value || value === "0") {
      setDecimal("0");
      setBinary("0");
      setOctal("0");
      setHexadecimal("0");
      return;
    }

    try {
      const num = parseInt(value, 8);
      if (isNaN(num)) return;

      setDecimal(num.toString(10));
      setBinary(num.toString(2));
      setOctal(value);
      setHexadecimal(num.toString(16).toUpperCase());
    } catch (e) {
      // Invalid input
    }
  };

  const updateAllFromHex = (value: string) => {
    if (!value || value === "0") {
      setDecimal("0");
      setBinary("0");
      setOctal("0");
      setHexadecimal("0");
      return;
    }

    try {
      const num = parseInt(value, 16);
      if (isNaN(num)) return;

      setDecimal(num.toString(10));
      setBinary(num.toString(2));
      setOctal(num.toString(8));
      setHexadecimal(value.toUpperCase());
    } catch (e) {
      // Invalid input
    }
  };

  const handleReset = () => {
    setDecimal("0");
    setBinary("0");
    setOctal("0");
    setHexadecimal("0");
  };

  return (
    <div className="space-y-6">
      {/* Decimal */}
      <div>
        <Input
          label="Decimal (Base 10)"
          value={decimal}
          onChange={(e) => updateAllFromDecimal(e.target.value)}
          placeholder="42"
          showCopy
          className="font-mono text-sm"
        />
        <div className="text-xs text-muted-foreground mt-1">
          Digits: 0-9
        </div>
      </div>

      {/* Binary */}
      <div>
        <Input
          label="Binary (Base 2)"
          value={binary}
          onChange={(e) => updateAllFromBinary(e.target.value)}
          placeholder="101010"
          showCopy
          className="font-mono text-sm"
        />
        <div className="text-xs text-muted-foreground mt-1">
          Digits: 0-1
        </div>
      </div>

      {/* Octal */}
      <div>
        <Input
          label="Octal (Base 8)"
          value={octal}
          onChange={(e) => updateAllFromOctal(e.target.value)}
          placeholder="52"
          showCopy
          className="font-mono text-sm"
        />
        <div className="text-xs text-muted-foreground mt-1">
          Digits: 0-7
        </div>
      </div>

      {/* Hexadecimal */}
      <div>
        <Input
          label="Hexadecimal (Base 16)"
          value={hexadecimal}
          onChange={(e) => updateAllFromHex(e.target.value)}
          placeholder="2A"
          showCopy
          className="font-mono text-sm mb-2"
        />
        <div className="text-xs text-muted-foreground mb-2">
          Digits: 0-9, A-F
        </div>
        <Button onClick={handleReset} variant="secondary" className="w-full">
          Reset
        </Button>
      </div>
    </div>
  );
}

export const numberBaseConfig: ToolConfig = {
  id: "number-base",
  name: "Number Base Converter",
  description: "Convert numbers between different bases (binary, octal, decimal, hexadecimal)",
  category: "converters",
  component: NumberBaseTool,
  seo: {
    keywords: [
      "binary converter",
      "hex to decimal",
      "decimal to binary",
      "hexadecimal converter",
      "octal converter",
      "base converter",
      "number system converter",
      "binary to decimal",
      "decimal to hex",
      "hex converter",
      "binary calculator",
      "base conversion",
    ],
  },
  sections: [
    {
      title: "What are Number Systems?",
      content: (
        <ul className="list-disc list-inside space-y-1">
          <li>Binary (Base 2): Uses digits 0-1, commonly used in computing</li>
          <li>Octal (Base 8): Uses digits 0-7, legacy systems</li>
          <li>Decimal (Base 10): Uses digits 0-9, standard human counting</li>
          <li>Hexadecimal (Base 16): Uses digits 0-9 and A-F, used for colors, memory addresses</li>
        </ul>
      ),
    },
    {
      title: "How does it work?",
      content: (
        <>
          <h4 className="text-base font-semibold mb-2">Conversion Process</h4>
          <p className="text-sm mb-4">Number base conversion works by interpreting digits according to their positional values in different bases. Each digit is multiplied by the base raised to its position power, then summed together. The tool converts between bases by first interpreting the input in its specified base, then expressing the value in the target base.</p>

          <h4 className="text-base font-semibold mb-2">Common Uses</h4>
          <p className="text-sm mb-4">Hexadecimal is widely used in web development for colors (#FF5733), in programming for memory addresses, and in cryptocurrency for addresses and hashes. Binary is fundamental to all computer operations.</p>
        </>
      ),
    },
  ],
  examples: [
    {
      title: "The number 42",
      content: "Decimal: 42, Binary: 101010, Octal: 52, Hex: 2A",
      type: "code",
    },
    {
      title: "The number 255",
      content: "Decimal: 255, Binary: 11111111, Octal: 377, Hex: FF",
      type: "code",
    },
    {
      title: "The number 1000",
      content: "Decimal: 1000, Binary: 1111101000, Octal: 1750, Hex: 3E8",
      type: "code",
    },
  ],
  references: [
    {
      title: "Number Systems - Wikipedia",
      url: "https://en.wikipedia.org/wiki/Numeral_system",
    },
    {
      title: "Binary Number System",
      url: "https://en.wikipedia.org/wiki/Binary_number",
    },
  ],
};
