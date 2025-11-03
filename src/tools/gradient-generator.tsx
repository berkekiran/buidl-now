"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToolConfig } from "@/types/tool";

interface ColorStop {
  id: string;
  color: string;
  position: number;
}

type GradientType = "linear" | "radial";

export function GradientGeneratorTool() {
  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState("90");
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { id: "1", color: "#667eea", position: 0 },
    { id: "2", color: "#764ba2", position: 100 },
  ]);

  const generateGradientCSS = (): string => {
    const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
    const stops = sortedStops.map((stop) => `${stop.color} ${stop.position}%`).join(", ");

    if (gradientType === "linear") {
      return `linear-gradient(${angle}deg, ${stops})`;
    } else {
      return `radial-gradient(circle, ${stops})`;
    }
  };

  const addColorStop = () => {
    if (colorStops.length >= 5) return;

    const newStop: ColorStop = {
      id: Date.now().toString(),
      color: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"),
      position: 50,
    };
    setColorStops([...colorStops, newStop]);
  };

  const removeColorStop = (id: string) => {
    if (colorStops.length <= 2) return;
    setColorStops(colorStops.filter((stop) => stop.id !== id));
  };

  const updateColorStop = (id: string, field: "color" | "position", value: string | number) => {
    setColorStops(
      colorStops.map((stop) =>
        stop.id === id ? { ...stop, [field]: value } : stop
      )
    );
  };

  const generateRandomGradient = () => {
    const randomColor = () =>
      "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");

    setColorStops([
      { id: "1", color: randomColor(), position: 0 },
      { id: "2", color: randomColor(), position: 100 },
    ]);
    setAngle(Math.floor(Math.random() * 360).toString());
  };

  const cssCode = generateGradientCSS();

  return (
    <div className="space-y-6">
      {/* Gradient Type Selection */}
      <div>
        <Label className="mb-2 block text-sm">Gradient Type</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={gradientType === "linear" ? "default" : "secondary"}
            onClick={() => setGradientType("linear")}
            className="w-full"
          >
            Linear
          </Button>
          <Button
            variant={gradientType === "radial" ? "default" : "secondary"}
            onClick={() => setGradientType("radial")}
            className="w-full"
          >
            Radial
          </Button>
        </div>
      </div>

      {/* Angle Control (Linear only) */}
      {gradientType === "linear" && (
        <div>
          <Label className="mb-2 block text-sm">Angle: {angle}°</Label>
          <input
            type="range"
            min="0"
            max="360"
            value={angle}
            onChange={(e) => setAngle(e.target.value)}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
          />
          <div className="flex justify-between text-xs text-white/40 mt-1">
            <span>0°</span>
            <span>90°</span>
            <span>180°</span>
            <span>270°</span>
            <span>360°</span>
          </div>
        </div>
      )}

      {/* Color Stops */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm">Color Stops</Label>
          {colorStops.length < 5 && (
            <Button onClick={addColorStop} variant="secondary" size="sm">
              Add Color Stop
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {colorStops.map((stop, index) => (
            <div
              key={stop.id}
              className="flex items-center gap-3 p-3 bg-[#0f0f0f] border border-white/10 rounded"
            >
              <div className="flex-shrink-0">
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => updateColorStop(stop.id, "color", e.target.value)}
                  className="w-12 h-12 rounded cursor-pointer border border-white/10"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  value={stop.color}
                  onChange={(e) => updateColorStop(stop.id, "color", e.target.value)}
                  placeholder="#000000"
                  className="font-mono text-sm"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={stop.position}
                    onChange={(e) =>
                      updateColorStop(stop.id, "position", parseInt(e.target.value))
                    }
                    className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                  <span className="text-xs text-white/60 w-12 text-right">
                    {stop.position}%
                  </span>
                </div>
              </div>
              {colorStops.length > 2 && (
                <Button
                  onClick={() => removeColorStop(stop.id)}
                  variant="secondary"
                  size="sm"
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Random Gradient Button */}
      <Button onClick={generateRandomGradient} variant="secondary" className="w-full">
        Generate Random Gradient
      </Button>

      {/* Gradient Preview */}
      <div>
        <Label className="mb-2 block text-sm">Gradient Preview</Label>
        <div
          className="h-48 w-full rounded border border-white/10"
          style={{ background: cssCode }}
        />
      </div>

      {/* CSS Output */}
      <Input
        label="CSS Code"
        value={`background: ${cssCode};`}
        readOnly
        showCopy
        className="font-mono text-sm bg-[#0f0f0f]"
      />

      {/* Additional CSS Formats */}
      <div className="grid grid-cols-1 gap-3">
        <Input
          label="CSS Property Value"
          value={cssCode}
          readOnly
          showCopy
          className="font-mono text-sm bg-[#0f0f0f]"
        />
        <Input
          label="Background Image"
          value={`background-image: ${cssCode};`}
          readOnly
          showCopy
          className="font-mono text-sm bg-[#0f0f0f]"
        />
      </div>
    </div>
  );
}

export const gradientGeneratorConfig: ToolConfig = {
  id: "gradient-generator",
  name: "Gradient Generator",
  description: "Create beautiful CSS gradients with multiple color stops",
  category: "graphic",
  component: GradientGeneratorTool,
  seo: {
    keywords: [
      "css gradient",
      "gradient generator",
      "linear gradient",
      "color gradient",
      "radial gradient",
      "gradient maker",
      "css gradient tool",
      "gradient background",
      "gradient css code",
      "gradient online",
    ],
  },
  sections: [
    {
      title: "What are CSS Gradients?",
      content:
        "CSS gradients create smooth transitions between two or more colors. They can be used as backgrounds, borders, and other properties. Gradients are rendered by the browser and scale perfectly without pixelation.",
    },
    {
      title: "How does it work?",
      content: (
        <>
          <p className="text-sm mb-4">
            Gradients work by defining color stops at specific positions along a path. Linear gradients transition colors along a straight line at a specified angle, while radial gradients transition from a center point outward in a circular pattern. The browser smoothly blends colors between each stop, creating seamless transitions. You can control the gradient by adjusting the angle, color values, and position of each color stop (0% to 100%).
          </p>

          <h4 className="text-base font-semibold mb-2">Gradient Types</h4>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Linear Gradient:</strong> Colors transition along a straight line at a specified angle</li>
            <li><strong>Radial Gradient:</strong> Colors transition from a center point outward in a circular pattern</li>
          </ul>
        </>
      ),
    },
  ],
  examples: [
    {
      title: "Linear gradient",
      content: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
      type: "code",
    },
    {
      title: "Radial gradient",
      content: "radial-gradient(circle, #667eea 0%, #764ba2 100%)",
      type: "code",
    },
    {
      title: "Multi-stop gradient",
      content: "linear-gradient(90deg, #ff0000 0%, #00ff00 50%, #0000ff 100%)",
      type: "code",
    },
  ],
  references: [
    {
      title: "CSS Gradients - MDN Web Docs",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Images/Using_CSS_gradients",
    },
    {
      title: "Linear Gradient",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/linear-gradient",
    },
  ],
};
