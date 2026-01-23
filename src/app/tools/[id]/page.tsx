"use client";

import { use, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { notFound, useRouter } from "next/navigation";
import { getToolById } from "@/tools";
import { tools } from "@/lib/tools-list";
import { ToolRenderer } from "./tool-renderer";
import { ToolStructuredData } from "@/components/structured-data";
import { Code } from "@/components/ui/code";
import { MdCode, MdClose, MdArrowBack, MdOpenInNew, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { FiInfo } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

type ViewMode = "tool" | "info" | "code";

export default function ToolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const tool = getToolById(id);
  const toolMeta = tools.find((t) => t.id === id);
  const router = useRouter();

  const [viewMode, setViewMode] = useState<ViewMode>("tool");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (viewMode !== "tool") {
          setViewMode("tool");
        } else {
          router.push("/");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, viewMode]);

  if (!tool || !toolMeta) {
    notFound();
  }

  const hasInfo = (tool.sections && tool.sections.length > 0) || (tool.examples && tool.examples.length > 0) || (tool.references && tool.references.length > 0);
  const hasCode = !!tool.codeSnippet;

  // Get previous and next tools
  const currentIndex = tools.findIndex((t) => t.id === id);
  const prevTool = currentIndex > 0 ? tools[currentIndex - 1] : null;
  const nextTool = currentIndex < tools.length - 1 ? tools[currentIndex + 1] : null;

  const getTitle = () => {
    if (viewMode === "info") return "Information";
    if (viewMode === "code") return "Source Code";
    return tool.name;
  };

  const getDescription = () => {
    if (viewMode === "info") return "Details and examples";
    if (viewMode === "code") return "TypeScript implementation";
    return tool.description;
  };

  // Shared Tool Card Content
  const ToolCardContent = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-gray-100)] shrink-0">
        <div className="flex items-center gap-3">
          {viewMode !== "tool" && (
            <button
              onClick={() => setViewMode("tool")}
              className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-[var(--color-gray-0)] border border-[var(--color-gray-200)] hover:bg-[var(--color-gray-50)] flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Back"
            >
              <MdArrowBack style={{ width: 20, height: 20 }} />
            </button>
          )}
          <div>
            <h1 className="text-base font-semibold">{getTitle()}</h1>
            <p className="text-xs text-muted-foreground">{getDescription()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {viewMode === "tool" && (
            <>
              {hasInfo && (
                <button
                  onClick={() => setViewMode("info")}
                  className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-[var(--color-gray-0)] border border-[var(--color-gray-200)] hover:bg-[var(--color-gray-50)] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title="Info"
                >
                  <FiInfo style={{ width: 20, height: 20 }} />
                </button>
              )}
              {hasCode && (
                <button
                  onClick={() => setViewMode("code")}
                  className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-[var(--color-gray-0)] border border-[var(--color-gray-200)] hover:bg-[var(--color-gray-50)] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title="Source Code"
                >
                  <MdCode style={{ width: 20, height: 20 }} />
                </button>
              )}
            </>
          )}
          <button
            onClick={() => router.push("/")}
            className="hidden lg:flex w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-[var(--color-gray-0)] border border-[var(--color-gray-200)] hover:bg-[var(--color-gray-50)] items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Close (ESC)"
          >
            <MdClose style={{ width: 20, height: 20 }} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Tool View */}
          {viewMode === "tool" && (
            <motion.div
              key="tool"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <ToolRenderer toolId={id} />
            </motion.div>
          )}

          {/* Info View */}
          {viewMode === "info" && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-6 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[var(--color-gray-950)] [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[var(--color-gray-950)] [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[var(--color-gray-950)] [&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-[var(--color-gray-950)] [&_h5]:text-sm [&_h5]:font-semibold [&_h5]:text-[var(--color-gray-950)] [&_h6]:text-sm [&_h6]:font-medium [&_h6]:text-[var(--color-gray-950)]"
            >
              {/* Sections */}
              {tool.sections && tool.sections.length > 0 && (
                <>
                  {tool.sections.map((section, index) => (
                    <div key={index}>
                      <h3 className="mb-2 text-base font-semibold">
                        {section.title}
                      </h3>
                      {typeof section.content === "string" ? (
                        <p className="text-sm leading-relaxed text-muted-foreground">{section.content}</p>
                      ) : (
                        <div className="text-sm leading-relaxed text-muted-foreground">{section.content}</div>
                      )}
                    </div>
                  ))}
                </>
              )}

              {/* Examples */}
              {tool.examples && tool.examples.length > 0 && (
                <div>
                  <h3 className="mb-2 text-base font-semibold">Examples</h3>
                  <div className="space-y-3">
                    {tool.examples.map((example, index) => (
                      <div key={index}>
                        {example.title && (
                          <h4 className="mb-1 text-sm font-medium">{example.title}</h4>
                        )}
                        {example.type === "code" || (typeof example.content === "string" && !example.type) ? (
                          <Code showLineNumbers={false}>
                            {typeof example.content === "string" ? example.content : JSON.stringify(example.content, null, 2)}
                          </Code>
                        ) : (
                          <div className="text-sm leading-relaxed text-muted-foreground">{example.content}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* References */}
              {tool.references && tool.references.length > 0 && (
                <div>
                  <h3 className="mb-2 text-base font-semibold">References</h3>
                  <div className="space-y-1">
                    {tool.references.map((ref, index) => (
                      <div key={index} className="text-sm">
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[var(--color-gray-950)] hover:opacity-60"
                        >
                          {ref.title}
                          <MdOpenInNew style={{ width: 14, height: 14 }} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Code View */}
          {viewMode === "code" && tool.codeSnippet && (
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <Code language="typescript" showLineNumbers={true} showCopy={true}>
                {tool.codeSnippet}
              </Code>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );

  const desktopModal = (
    <div className="hidden lg:flex fixed inset-0 z-[9999] items-center justify-center">
      {/* Tool Modal Container with prev/next beside it */}
      <div className="relative w-[90%] max-w-2xl">
        {/* Prev Button - beside modal */}
        {prevTool && (
          <button
            onClick={() => router.push(prevTool.path)}
            className="flex absolute right-full top-1/2 -translate-y-1/2 mr-4 items-center gap-2 cursor-pointer group"
          >
            <div className="flex items-center gap-3 px-4 py-3 rounded-[16px] bg-[var(--color-gray-0)] border border-[var(--color-gray-200)] shadow-lg shadow-black/5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
              <div className="text-right overflow-hidden max-w-48">
                <div className="text-xs text-muted-foreground mb-0.5">Previous</div>
                <div className="text-sm font-medium truncate">{prevTool.name}</div>
              </div>
            </div>
            <div className="w-10 h-10 flex items-center justify-center shrink-0 text-[var(--color-gray-400)] group-hover:text-[var(--color-gray-950)] transition-colors">
              <MdChevronLeft className="w-8 h-8" />
            </div>
          </button>
        )}

        {/* Next Button - beside modal */}
        {nextTool && (
          <button
            onClick={() => router.push(nextTool.path)}
            className="flex absolute left-full top-1/2 -translate-y-1/2 ml-4 items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 flex items-center justify-center shrink-0 text-[var(--color-gray-400)] group-hover:text-[var(--color-gray-950)] transition-colors">
              <MdChevronRight className="w-8 h-8" />
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-[16px] bg-[var(--color-gray-0)] border border-[var(--color-gray-200)] shadow-lg shadow-black/5 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0">
              <div className="text-left overflow-hidden max-w-48">
                <div className="text-xs text-muted-foreground mb-0.5">Next</div>
                <div className="text-sm font-medium truncate">{nextTool.name}</div>
              </div>
            </div>
          </button>
        )}

        {/* Tool Card */}
        <div className="w-full max-h-[90vh] bg-[var(--color-gray-0)] rounded-[20px] overflow-hidden flex flex-col border border-[var(--color-gray-200)] shadow-xl shadow-black/5">
          <ToolCardContent />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <ToolStructuredData tool={toolMeta} />

      {/* Desktop: Portal to body */}
      {mounted && createPortal(desktopModal, document.body)}

      {/* Mobile: Normal Page Layout */}
      <div className="lg:hidden pb-8 px-4">
        {/* Tool Card */}
        <div className="bg-[var(--color-gray-0)] rounded-[20px] overflow-hidden flex flex-col border border-[var(--color-gray-200)] shadow-lg shadow-black/5 max-w-2xl mx-auto">
          <ToolCardContent />
        </div>

        {/* Mobile Prev/Next Buttons */}
        <div className="flex justify-center gap-4 mt-6 max-w-2xl mx-auto">
          {prevTool && (
            <button
              onClick={() => router.push(prevTool.path)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-[16px] bg-[var(--color-gray-0)] border border-[var(--color-gray-200)] cursor-pointer"
            >
              <MdChevronLeft className="w-5 h-5" />
              <span className="text-sm truncate">{prevTool.name}</span>
            </button>
          )}
          {nextTool && (
            <button
              onClick={() => router.push(nextTool.path)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-[16px] bg-[var(--color-gray-0)] border border-[var(--color-gray-200)] cursor-pointer"
            >
              <span className="text-sm truncate">{nextTool.name}</span>
              <MdChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
