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
        {/* Left side content - Desktop only */}
        <div className="hidden xl:flex fixed left-0 top-0 bottom-0 w-[calc(50%-300px)] z-10 justify-center items-center py-32">
          <div className="max-w-xs px-6 overflow-y-auto max-h-full no-scrollbar">
            <h1 className="text-4xl 2xl:text-5xl font-normal text-[var(--color-gray-950)] mb-4 tracking-tight leading-tight" style={{ fontFamily: 'var(--font-turret), sans-serif' }}>
              Buidl <span className="italic">Now!</span>
            </h1>
            <p className="text-base text-[var(--color-gray-600)] leading-relaxed mb-6">
              Essential developer tools for builders who ship fast. No ads, no tracking.
              Just tools that work.
            </p>

            <p className="text-xs font-medium tracking-[0.2em] text-[var(--color-gray-400)] mb-3 uppercase" style={{ fontFamily: 'var(--font-turret), sans-serif' }}>
              What's inside
            </p>
            <div className="space-y-2 text-sm text-[var(--color-gray-600)] mb-6">
              <p>
                <span className="font-medium text-[var(--color-gray-900)]">
                  70+ developer tools
                </span>{" "}
                built for speed. ABI encoder/decoder, function selectors, keccak
                hash, unit converters, and everything else you need when
                building on Ethereum.
              </p>
              <p>
                <span className="font-medium text-[var(--color-gray-900)]">
                  Format, convert, generate.
                </span>{" "}
                JSON/YAML/XML converters, SQL formatter, hash generators,
                UUID/nanoid generators, color tools, and more.
              </p>
              <p>
                <span className="font-medium text-[var(--color-gray-900)]">
                  DeFi & Protocol tools.
                </span>{" "}
                Uniswap price calculator, token launch calculator, gas
                estimator, timelock transaction builder, Safe batch builder.
              </p>
            </div>

            <p className="text-xs font-medium tracking-[0.2em] text-[var(--color-gray-400)] mb-3 uppercase" style={{ fontFamily: 'var(--font-turret), sans-serif' }}>
              Why this exists
            </p>
            <div className="space-y-2 text-sm text-[var(--color-gray-600)] mb-6">
              <p>
                Tired of googling "keccak256 online" every time you need to hash
                something. Tired of jumping between 10 different sites for basic
                operations.
              </p>
              <p>
                So we built one place with everything. Fast, keyboard-friendly.
                Start typing anywhere to search.
              </p>
            </div>

            <p className="text-xs font-medium tracking-[0.2em] text-[var(--color-gray-400)] mb-3 uppercase" style={{ fontFamily: 'var(--font-turret), sans-serif' }}>
              Popular tools
            </p>
            <div className="space-y-1.5 text-sm">
              <Link
                href="/tools/abi-encoder"
                className="block text-[var(--color-gray-600)] hover:text-[var(--color-gray-900)] transition-colors"
              >
                ABI Encoder/Decoder
              </Link>
              <Link
                href="/tools/keccak-hash"
                className="block text-[var(--color-gray-600)] hover:text-[var(--color-gray-900)] transition-colors"
              >
                Keccak-256 Hash
              </Link>
              <Link
                href="/tools/eth-unit-converter"
                className="block text-[var(--color-gray-600)] hover:text-[var(--color-gray-900)] transition-colors"
              >
                ETH Unit Converter
              </Link>
              <Link
                href="/tools/json-formatter"
                className="block text-[var(--color-gray-600)] hover:text-[var(--color-gray-900)] transition-colors"
              >
                JSON Formatter
              </Link>
              <Link
                href="/tools/function-selector"
                className="block text-[var(--color-gray-600)] hover:text-[var(--color-gray-900)] transition-colors"
              >
                Function Selector
              </Link>
            </div>

            <p className="mt-6 text-xs text-[var(--color-gray-400)]" style={{ fontFamily: 'var(--font-turret), sans-serif' }}>
              100% free and open source.
            </p>
          </div>
        </div>

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
                tool: tools.find((t) => t.id === "json-formatter"),
                icon: MdCode,
              },
            ]
              .filter((item) => item.tool)
              .map(({ tool, icon: Icon }) => (
                <Link key={tool!.id} href={tool!.path}>
                  <Button size="sm" className="text-xs gap-1.5">
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
