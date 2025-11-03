"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MdArrowBack } from "react-icons/md";

export function Header() {
  const pathname = usePathname();
  const isToolPage = pathname?.startsWith("/tools/");
  const isHomePage = pathname === "/";

  // Don't show header on homepage
  if (isHomePage) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute top-0 left-0 right-0 z-0 h-24 w-full bg-gradient-to-b from-background via-background/75 to-transparent pointer-events-none"></div>
      <div className="relative z-10 max-w-[640px] w-full mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white hover:opacity-50 transition-opacity">
          <Image src="/buidl-now-logo.svg" alt="Buidl Now" width={32} height={32} className="w-7 h-7 sm:w-8 sm:h-8" />
          <div className="flex flex-row items-center gap-1">
            <span className="text-sm sm:text-md font-medium">Buidl</span>
            <span className="text-sm sm:text-md font-normal italic">Now!</span>
          </div>
        </Link>

        {isToolPage && (
          <Link
            href="/"
            className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
          >
            <MdArrowBack className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Return to Toolbag</span>
            <span className="sm:hidden">Back</span>
          </Link>
        )}
      </div>
    </header>
  );
}
