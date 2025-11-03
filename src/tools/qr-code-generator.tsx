"use client";

import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ToolConfig } from "@/types/tool";
import QRCode from "qrcode";

export function QrCodeGeneratorTool() {
  const [input, setInput] = useState("");
  const [size, setSize] = useState("256");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleGenerate = async () => {
    if (!input.trim()) {
      setError("Please enter text or URL");
      setQrDataUrl("");
      return;
    }

    try {
      const qrSize = Math.min(Math.max(parseInt(size) || 256, 128), 1024);
      const dataUrl = await QRCode.toDataURL(input, {
        width: qrSize,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrDataUrl(dataUrl);
      setError("");
    } catch (e) {
      setError("Failed to generate QR code");
      setQrDataUrl("");
    }
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Textarea
        label="Text or URL"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text, URL, or any data to encode..."
        rows={4}
        className="text-sm"
      />

      {/* Size Input */}
      <div>
        <Label className="mb-2 block text-sm">QR Code Size (128-1024)</Label>
        <Input
          type="number"
          min="128"
          max="1024"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          placeholder="256"
        />
      </div>

      {/* Generate Button */}
      <Button onClick={handleGenerate} className="w-full">
        Generate QR Code
      </Button>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* QR Code Display */}
      {qrDataUrl && (
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded">
            <img src={qrDataUrl} alt="QR Code" className="max-w-full" />
          </div>
          <Button onClick={handleDownload} variant="secondary" className="w-full">
            Download QR Code
          </Button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

export const qrCodeGeneratorConfig: ToolConfig = {
  id: "qr-code-generator",
  name: "QR Code Generator",
  description: "Generate QR codes from text or URLs",
  category: "generators",
  component: QrCodeGeneratorTool,
  seo: {
    keywords: [
      "qr code generator",
      "create qr code",
      "qr code maker",
      "generate qr code online",
      "qr code creator",
      "free qr code generator",
      "qr code tool",
      "make qr code",
      "qr generator",
      "quick response code",
      "barcode generator",
      "qr code download",
    ],
  },
  sections: [
    {
      title: "What is a QR Code?",
      content:
        "A QR (Quick Response) code is a two-dimensional barcode that can store various types of data including URLs, text, contact information, and more. QR codes can be scanned by smartphones and other devices with cameras.",
    },
    {
      title: "How does it work?",
      content: (
        <>
          <h4 className="text-base font-semibold mb-2">Using This Tool</h4>
          <p className="text-sm mb-4">Enter any text, URL, or data you want to encode into a QR code. Adjust the size if needed (default is 256px), then click Generate. You can download the generated QR code as a PNG image.</p>

          <h4 className="text-base font-semibold mb-2">Size Guidelines</h4>
          <p className="text-sm mb-4">The recommended minimum size for a QR code is 2x2 cm (0.8x0.8 inches) for reliable scanning. Larger codes are easier to scan from a distance. The tool supports sizes from 128px to 1024px.</p>
        </>
      ),
    },
  ],
  examples: [
    {
      title: "URL",
      content: "https://example.com",
      type: "code",
    },
    {
      title: "Contact Info",
      content: "MECARD:N:Doe,John;TEL:+1234567890;EMAIL:john@example.com;;",
      type: "code",
    },
    {
      title: "WiFi Network",
      content: "WIFI:T:WPA;S:NetworkName;P:password;;",
      type: "code",
    },
  ],
  references: [
    {
      title: "QR Code - Wikipedia",
      url: "https://en.wikipedia.org/wiki/QR_code",
    },
    {
      title: "QR Code Specification",
      url: "https://www.qrcode.com/en/about/",
    },
  ],
};
