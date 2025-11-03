"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Code } from "@/components/ui/code";
import { keccak256, toBytes } from "viem";
import { ToolConfig } from "@/types/tool";

export function FunctionSelectorTool() {
  const [functionSig, setFunctionSig] = useState("");
  const [selector, setSelector] = useState("");

  const calculateSelector = (signature: string) => {
    if (!signature) {
      setSelector("");
      return;
    }

    try {
      const cleanSig = signature.trim();
      if (!cleanSig.includes("(") || !cleanSig.includes(")")) {
        setSelector("");
        return;
      }

      const hash = keccak256(toBytes(cleanSig));
      const functionSelector = hash.slice(0, 10);
      setSelector(functionSelector);
    } catch (e) {
      setSelector("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFunctionSig(value);
    calculateSelector(value);
  };

  const handleReset = () => {
    setFunctionSig("");
    setSelector("");
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div>
        <Label className="mb-2 block text-sm">Function</Label>
        <Input
          value={functionSig}
          onChange={handleInputChange}
          placeholder="function ownerOf(uint256 tokenId)"
          className="font-mono text-sm mb-2"
        />
        <div className="flex gap-2">
          <Button onClick={() => calculateSelector(functionSig)} className="flex-1">
            Convert
          </Button>
          <Button onClick={handleReset} variant="secondary">
            Reset
          </Button>
        </div>
      </div>

      {/* Output Section */}
      <Input
        label="Function selector (4 byte encoding)"
        value={selector}
        readOnly
        showCopy
        className="font-mono text-sm bg-[#0f0f0f]"
      />
    </div>
  );
}

export const functionSelectorConfig: ToolConfig = {
  id: "function-selector",
  name: "Convert Function to Function Selector",
  description:
    "Generates the function selector (4 byte encoding) for a given function definition.",
  category: "web3",
  component: FunctionSelectorTool,
  seo: {
    keywords: [
      "function selector",
      "solidity function selector",
      "4 byte selector",
      "method id",
      "smart contract function",
      "ethereum abi",
      "function signature",
      "keccak256 function",
      "solidity method id",
    ],
  },
  sections: [
    {
      title: "What is a function selector?",
      content:
        "The function selector is a 4 byte identifier for functions in Solidity.",
    },
    {
      title: "How does it work?",
      content: (
        <>
          <h4 className="text-base font-semibold mb-2">How is the function selector calculated?</h4>
          <p className="text-sm mb-4">
            The function selector is given by turning a function into a signature, hashing the signature with keccak256, and taking the first 4 bytes. An example and function follows below on how to derive the function selector.
          </p>
          <div className="mb-4">
            <Code language="solidity">
{`function toSelector(string memory signature) internal pure returns (bytes4) {
    return bytes4(keccak256(signature));
}`}
            </Code>
          </div>
          <p className="text-sm">
            Reversing the operation from function selector to function is not as straight-forward. Instead, we suggest the reversal to use the{" "}
            <a
              href="https://www.4byte.directory/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 hover:underline"
            >
              Ethereum Signature Database
            </a>
            .
          </p>
        </>
      ),
    },
  ],
  examples: [
    {
      title: "ERC-20 balanceOf function",
      content: "balanceOf(address) → 0x70a08231",
      type: "code",
    },
    {
      title: "ERC-721 ownerOf function",
      content: "ownerOf(uint256) → 0x6352211e",
      type: "code",
    },
    {
      title: "Complex function with array parameter",
      content: "batch((address,address,uint256,bytes)[]) → 0xc16ae7a4",
      type: "code",
    },
  ],
  references: [
    {
      title: "viem: toFunctionSelector",
      url: "https://viem.sh/docs/contract/toFunctionSelector",
    },
    {
      title: "Solidity by Example: Function Selector",
      url: "https://docs.soliditylang.org/en/latest/abi-spec.html#function-selector-and-argument-encoding",
    },
  ],
};
