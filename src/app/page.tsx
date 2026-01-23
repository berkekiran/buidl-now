"use client";

import { tools } from "@/lib/tools-list";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  MdSearch,
  MdClose,
  MdKeyboardReturn,
  MdAccessTime,
  MdOutlineCurrencyExchange,
  MdCode,
} from "react-icons/md";
import {
  WebsiteStructuredData,
  OrganizationStructuredData,
} from "@/components/structured-data";
// Image removed - logo now only in header

function HomeContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedItemRef = useRef<HTMLAnchorElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize search query from URL parameter
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  const filteredTools = searchQuery
    ? tools.filter((tool) =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  // Focus search input when user starts typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if already focused or if modifier keys are pressed
      if (
        document.activeElement === searchInputRef.current ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        e.key === "Tab"
      ) {
        return;
      }

      // Focus input when user types any character
      if (e.key.length === 1 && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Scroll selected item into view when selectedIndex changes
  useEffect(() => {
    if (selectedItemRef.current) {
      const container = selectedItemRef.current.closest("[data-scrollable]");
      if (container) {
        const itemRect = selectedItemRef.current.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const offset = 8; // py-2 = 0.5rem = 8px padding

        if (itemRect.top < containerRect.top + offset) {
          // Item is above visible area
          container.scrollTop -= containerRect.top + offset - itemRect.top;
        } else if (itemRect.bottom > containerRect.bottom - offset) {
          // Item is below visible area
          container.scrollTop +=
            itemRect.bottom - containerRect.bottom + offset;
        }
      }
    }
  }, [selectedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!searchQuery || filteredTools.length === 0) return;

    if (e.key === "Enter") {
      e.preventDefault();
      window.location.href = filteredTools[selectedIndex].path;
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredTools.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }
  };

  // Reset selected index when search query changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedIndex(0);
  };

  return (
    <>
      <WebsiteStructuredData />
      <OrganizationStructuredData />

      <div className="h-screen w-screen overflow-hidden">
        {/* Search Bar - Exactly centered */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-full max-w-xl px-4 z-50">
          <MdSearch className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className="pl-10 pr-24 h-12 text-base"
          />
          <div className="absolute right-7 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {searchQuery && filteredTools.length > 0 && (
              <kbd className="hidden sm:inline-flex items-center justify-center px-2 h-7 text-muted-foreground rounded border border-muted-foreground/30 min-w-8">
                <MdKeyboardReturn className="w-4 h-4" />
              </kbd>
            )}
            {searchQuery && (
              <Button
                onClick={() => setSearchQuery("")}
               
                size="sm"
                className="text-muted-foreground hover:text-foreground h-auto p-1 min-h-0"
              >
                <MdClose className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Search Results - Below Search Box */}
          <div
            data-scrollable
            className={`absolute left-0 right-0 top-full mt-2 bg-[var(--color-gray-0)] rounded-[16px] max-h-[40vh] overflow-y-auto z-[100] transition-all duration-200 ease-out border border-[var(--color-gray-200)] shadow-xl shadow-black/5 ${
              searchQuery
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
          >
            {filteredTools.length === 0 ? (
              <div className="py-6 px-2 text-center">
                <p className="text-sm text-muted-foreground">
                  No tools found. Try a different search?
                </p>
              </div>
            ) : (
              <div className="py-2 px-2">
                {filteredTools.map((tool, index) => (
                  <Link
                    key={tool.id}
                    ref={index === selectedIndex ? selectedItemRef : null}
                    href={tool.path}
                    className={`block px-4 py-3 rounded-[12px] transition-all duration-200 border ring-2 ${
                      index === selectedIndex
                        ? "bg-[var(--color-gray-0)] border-[var(--color-blue-500)] ring-[var(--color-blue-500)]/20"
                        : "border-transparent ring-transparent hover:bg-[var(--color-gray-100)]/50"
                    }`}
                    onClick={() => setSearchQuery("")}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex items-center gap-2.5 mb-0.5">
                      {tool.icon && (
                        <tool.icon className="w-4 h-4 text-[var(--color-gray-400)]" />
                      )}
                      <div className="font-medium text-[var(--color-gray-950)]">
                        {tool.name}
                      </div>
                    </div>
                    <div className="text-sm text-[var(--color-gray-400)]">
                      {tool.description}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Featured Tools - Below center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-10 w-[90%] md:w-full max-w-xl px-4 z-10">
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              {
                tool: tools.find((t) => t.id === "epoch-converter"),
                icon: MdAccessTime,
              },
              {
                tool: tools.find((t) => t.id === "eth-unit-converter"),
                icon: MdOutlineCurrencyExchange,
              },
              {
                tool: tools.find((t) => t.id === "json-validator"),
                icon: MdCode,
              },
            ]
              .filter((item) => item.tool)
              .map(({ tool, icon: Icon }) => (
                <Link key={tool!.id} href={tool!.path}>
                  <Button
                   
                    size="sm"
                    className="text-xs gap-1.5"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tool!.name}
                  </Button>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent />
    </Suspense>
  );
}

function HomeLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-xl">
        <div className="h-12 bg-muted/20 rounded-md animate-pulse" />
      </div>
    </div>
  );
}
