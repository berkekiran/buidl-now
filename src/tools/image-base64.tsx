"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToolConfig } from "@/types/tool";

export function ImageBase64Tool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [base64String, setBase64String] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [encodedSize, setEncodedSize] = useState(0);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError("");
    setSelectedFile(file);
    setOriginalSize(file.size);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setBase64String(result);
      setPreviewUrl(result);
      setEncodedSize(result.length);
    };
    reader.onerror = () => {
      setError("Failed to read file");
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setBase64String("");
    setPreviewUrl("");
    setOriginalSize(0);
    setEncodedSize(0);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <div>
        <Label className="mb-2 block text-sm">Select Image</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="block w-full text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer"
        />
        <p className="mt-2 text-xs text-white/40">
          Maximum file size: 5MB. Supported formats: PNG, JPG, GIF, SVG, WebP
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Preview and Results */}
      {selectedFile && base64String && (
        <div className="space-y-4">
          {/* Image Preview */}
          <div>
            <Label className="mb-2 block text-sm">Image Preview</Label>
            <div className="border border-white/10 rounded p-4 bg-[#0f0f0f] flex items-center justify-center">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full max-h-64 object-contain"
              />
            </div>
          </div>

          {/* File Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-[#0f0f0f] border border-white/10 rounded">
              <Label className="text-xs text-white/60 mb-1 block">Original Size</Label>
              <p className="text-sm font-mono">{formatBytes(originalSize)}</p>
            </div>
            <div className="p-3 bg-[#0f0f0f] border border-white/10 rounded">
              <Label className="text-xs text-white/60 mb-1 block">Encoded Size</Label>
              <p className="text-sm font-mono">{formatBytes(encodedSize)}</p>
            </div>
          </div>

          {/* Base64 Output */}
          <Input
            label="Base64 Data URL"
            value={base64String}
            readOnly
            showCopy
            className="font-mono text-xs bg-[#0f0f0f]"
          />

          {/* Size Warning */}
          {encodedSize > originalSize * 1.5 && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-400 text-sm">
              Note: Base64 encoding increases file size by approximately 33%. Consider using direct file references for large images.
            </div>
          )}

          {/* Reset Button */}
          <Button onClick={handleReset} variant="secondary" className="w-full">
            Reset
          </Button>
        </div>
      )}
    </div>
  );
}

export const imageBase64Config: ToolConfig = {
  id: "image-base64",
  name: "Image to Base64",
  description: "Convert images to Base64 data URLs for embedding in HTML/CSS",
  category: "converters",
  component: ImageBase64Tool,
  seo: {
    keywords: [
      "image to base64",
      "base64 image encoder",
      "convert image to base64",
      "base64 decoder image",
      "image base64 converter",
      "encode image base64",
      "base64 image tool",
      "data url converter",
      "image encoder online",
      "base64 encode image",
      "picture to base64",
    ],
  },
  sections: [
    {
      title: "What is Base64 Image Encoding?",
      content:
        "Base64 encoding converts image files into text strings that can be embedded directly in HTML or CSS. This eliminates separate HTTP requests for images but increases file size by approximately 33%.",
    },
    {
      title: "How does it work?",
      content: (
        <>
          <p className="text-sm mb-4">
            Base64 encoding converts binary image data into ASCII text by grouping binary data into 6-bit chunks and mapping each chunk to a character from a 64-character set (A-Z, a-z, 0-9, +, /). This encoding allows binary data to be safely transmitted in text-based formats like HTML, CSS, or JSON. The encoded string starts with a data URL prefix (e.g., 'data:image/png;base64,') followed by the Base64-encoded image data.
          </p>

          <h4 className="text-base font-semibold mb-2">When to Use Base64 Images</h4>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Small icons and logos:</strong> Reduce HTTP requests for tiny images</li>
            <li><strong>Email templates:</strong> Embed images when hosting is not available</li>
            <li><strong>Data URIs in CSS:</strong> Background images and sprites</li>
            <li><strong>Offline applications:</strong> Self-contained HTML files</li>
          </ul>
        </>
      ),
    },
  ],
  examples: [
    {
      title: "HTML Usage",
      content: '<img src="data:image/png;base64,iVBORw0KG..." alt="Image" />',
      type: "code",
    },
    {
      title: "CSS Usage",
      content: 'background-image: url("data:image/png;base64,iVBORw0KG...");',
      type: "code",
    },
  ],
  references: [
    {
      title: "Data URIs - MDN Web Docs",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs",
    },
    {
      title: "Base64 Encoding - Wikipedia",
      url: "https://en.wikipedia.org/wiki/Base64",
    },
  ],
};
