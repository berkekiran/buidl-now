"use client";

import { toolCategories, toolSubcategories } from "@/types/tools";
import { tools } from "@/lib/tools-list";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { MdSearch, MdClose } from "react-icons/md";
import Image from "next/image";
import { WebsiteStructuredData, OrganizationStructuredData } from "@/components/structured-data";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = searchQuery
    ? tools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tools;

  return (
    <>
      <WebsiteStructuredData />
      <OrganizationStructuredData />
      {/* Hero Section */}
      <div className="flex flex-col items-start mt-2 sm:mt-6 mb-6 sm:mb-8">
        <Link href="/" className="flex items-end gap-4 text-white hover:opacity-50 transition-opacity">
          <Image src="/buidl-now-logo.svg" alt="Buidl Now" width={80} height={80} className="w-24 h-24 sm:w-32 sm:h-32" />
          <div className="flex flex-col items-start justify-end gap-2">
            <div className="flex flex-row items-center gap-2">
              <span className="text-3xl sm:text-4xl font-medium">Buidl</span>
              <span className="text-3xl sm:text-4xl font-normal italic">Now!</span>
            </div>
            <span className="text-sm sm:text-base text-muted-foreground">Developer tools for builders who ship fast</span>
          </div>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-12">
        <div className="relative ">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <MdClose className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Tool Categories */}
      {filteredTools.length === 0 ? (
        <div className="py-12">
          <p className="text-sm text-muted-foreground">
            No tools found. Try a different search?
          </p>
        </div>
      ) : (
        toolCategories.map((category) => {
          const categoryTools = filteredTools.filter((t) => t.category === category.id);

          if (categoryTools.length === 0) return null;

          // Group tools by subcategory
          const subcategoryGroups = toolSubcategories
            .filter((sub) => sub.parent === category.id)
            .map((subcategory) => ({
              subcategory,
              tools: categoryTools.filter((t) => t.subcategory === subcategory.id),
            }))
            .filter((group) => group.tools.length > 0);

          // Tools without subcategory
          const uncategorizedTools = categoryTools.filter((t) => !t.subcategory);

          return (
            <section key={category.id} className="mb-12">
              <h2 className="mb-6 text-base font-medium text-muted-foreground flex items-center gap-2">
                <category.icon className="w-5 h-5" />
                {category.name}
              </h2>

              <div className="space-y-6">
                {/* Subcategory groups */}
                {subcategoryGroups.map(({ subcategory, tools: subTools }) => (
                  <div key={subcategory.id} className="pl-6">
                    <h3 className="mb-2 text-sm font-medium text-muted-foreground/70 flex items-center gap-2">
                      <subcategory.icon className="w-4 h-4" />
                      {subcategory.name}
                    </h3>
                    <div className="space-y-2 pl-6">
                      {subTools.map((tool) => (
                        <div key={tool.id} className="flex items-end gap-2">
                          <Link
                            href={tool.path}
                            className="hover:underline transition-colors whitespace-nowrap"
                          >
                            {tool.name}
                          </Link>
                          <div className="flex-1 h-[0.75px] mb-[6px] bg-muted-foreground/20"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Uncategorized tools */}
                {uncategorizedTools.length > 0 && (
                  <div>
                    <div className="space-y-2">
                      {uncategorizedTools.map((tool) => (
                        <div key={tool.id} className="flex items-end gap-2">
                          <Link
                            href={tool.path}
                            className="hover:underline transition-colors whitespace-nowrap"
                          >
                            {tool.name}
                          </Link>
                          <div className="flex-1 h-[0.75px] mb-[6px] bg-muted-foreground/20"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          );
        })
      )}
    </>
  );
}
