"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatEther, formatGwei, parseEther, parseGwei } from "viem";
import { ToolConfig } from "@/types/tool";

export function EthUnitConverterTool() {
  const [wei, setWei] = useState("");
  const [gwei, setGwei] = useState("");
  const [eth, setEth] = useState("");

  const updateFromWei = (value: string) => {
    if (!value || value === "0") {
      setWei("0");
      setGwei("0");
      setEth("0");
      return;
    }

    try {
      const weiBigInt = BigInt(value);
      setWei(value);
      setGwei(formatGwei(weiBigInt));
      setEth(formatEther(weiBigInt));
    } catch (e) {
      // Invalid input
    }
  };

  const updateFromGwei = (value: string) => {
    if (!value || value === "0") {
      setWei("0");
      setGwei("0");
      setEth("0");
      return;
    }

    try {
      const weiBigInt = parseGwei(value);
      setWei(weiBigInt.toString());
      setGwei(value);
      setEth(formatEther(weiBigInt));
    } catch (e) {
      // Invalid input
    }
  };

  const updateFromEth = (value: string) => {
    if (!value || value === "0") {
      setWei("0");
      setGwei("0");
      setEth("0");
      return;
    }

    try {
      const weiBigInt = parseEther(value);
      setWei(weiBigInt.toString());
      setGwei(formatGwei(weiBigInt));
      setEth(value);
    } catch (e) {
      // Invalid input
    }
  };

  const handleReset = () => {
    setWei("0");
    setGwei("0");
    setEth("0");
  };

  return (
    <div className="space-y-6">
      {/* Wei */}
      <div>
        <Input
          label="Wei"
          value={wei}
          onChange={(e) => updateFromWei(e.target.value)}
          placeholder="1000000000000000000"
          showCopy
          className="font-mono text-sm"
        />
        <div className="text-xs text-muted-foreground mt-1">
          1 Wei = 10⁻¹⁸ ETH
        </div>
      </div>

      {/* Gwei */}
      <div>
        <Input
          label="Gwei (Shannon)"
          value={gwei}
          onChange={(e) => updateFromGwei(e.target.value)}
          placeholder="1"
          showCopy
          className="font-mono text-sm"
        />
        <div className="text-xs text-muted-foreground mt-1">
          1 Gwei = 10⁻⁹ ETH = 10⁹ Wei
        </div>
      </div>

      {/* ETH */}
      <div>
        <Input
          label="ETH (Ether)"
          value={eth}
          onChange={(e) => updateFromEth(e.target.value)}
          placeholder="1.0"
          showCopy
          className="font-mono text-sm mb-2"
        />
        <div className="text-xs text-muted-foreground mb-2">
          1 ETH = 10⁹ Gwei = 10¹⁸ Wei
        </div>
        <Button onClick={handleReset} variant="secondary" className="w-full">
          Reset
        </Button>
      </div>
    </div>
  );
}

export const ethUnitConverterConfig: ToolConfig = {
  id: "eth-unit-converter",
  name: "ETH Unit Converter",
  description: "Convert between Wei, Gwei, and ETH",
  category: "web3",
  component: EthUnitConverterTool,
  seo: {
    keywords: [
      "eth converter",
      "wei to eth",
      "gwei to eth",
      "ethereum units",
      "wei gwei eth",
      "ethereum gas calculator",
      "eth unit converter",
      "wei converter",
      "gwei calculator",
    ],
  },
  sections: [
    {
      title: "What are Ethereum Units?",
      content:
        "Ethereum uses different units to express amounts of Ether. The base unit is Wei, and 1 ETH equals 10¹⁸ Wei. Gwei (gigawei) is commonly used for gas prices, representing 10⁹ Wei or 10⁻⁹ ETH.",
    },
    {
      title: "How does it work?",
      content: (
        <>
          <p className="text-sm mb-4">
            Unit conversion in Ethereum is based on powers of 10. To convert from a smaller unit to a larger one, you divide; to convert from larger to smaller, you multiply. For example, to convert Wei to ETH, divide by 10¹⁸. To convert ETH to Gwei, multiply by 10⁹. These conversions are essential for understanding transaction costs and token amounts.
          </p>

          <h4 className="text-base font-semibold mb-2">Common Units</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Wei: Smallest unit (10⁻¹⁸ ETH)</li>
            <li>Gwei (Shannon): 10⁹ Wei (10⁻⁹ ETH) - used for gas prices</li>
            <li>ETH (Ether): 10¹⁸ Wei - standard unit</li>
          </ul>
        </>
      ),
    },
  ],
  examples: [
    {
      title: "1 ETH in Wei",
      content: "1 ETH = 1,000,000,000,000,000,000 Wei",
      type: "code",
    },
    {
      title: "Gas price example",
      content: "20 Gwei = 20,000,000,000 Wei = 0.00000002 ETH",
      type: "code",
    },
    {
      title: "Small transaction",
      content: "0.01 ETH = 10,000,000 Gwei = 10,000,000,000,000,000 Wei",
      type: "code",
    },
  ],
  references: [
    {
      title: "viem: parseEther & formatEther",
      url: "https://viem.sh/docs/utilities/formatEther",
    },
    {
      title: "Ethereum Units",
      url: "https://ethereum.org/en/developers/docs/intro-to-ether/#denominations",
    },
  ],
};
