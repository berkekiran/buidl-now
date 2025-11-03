"use client";

import { getToolById } from "@/tools";

export function ToolRenderer({ toolId }: { toolId: string }) {
  const tool = getToolById(toolId);

  if (!tool) {
    return null;
  }

  const ToolComponent = tool.component;

  return <ToolComponent />;
}
