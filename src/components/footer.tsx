"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { MdApps } from "react-icons/md";

export function Footer() {
  const pathname = usePathname();
  const isToolsPage = pathname === "/tools";

  return (
    <>
      {/* Mobile Footer - Centered */}
      <div className={`global-footer lg:hidden ${isToolsPage ? "relative mt-4 pb-4" : "fixed bottom-6"} left-0 right-0 flex flex-col items-center gap-4 z-50`}>
        <div className="flex items-center gap-3 text-sm text-muted-foreground font-semibold" style={{ fontFamily: 'var(--font-turret), sans-serif' }}>
          <span>
            Built by{" "}
            <a
              href="https://berkekiran.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:opacity-50 transition-opacity"
            >
              Berke
            </a>
          </span>
          {!isToolsPage && (
            <>
              <span>·</span>
              <Link
                href="/tools"
                className="flex items-center gap-1 text-foreground hover:opacity-50 transition-opacity"
              >
                <MdApps className="w-4 h-4" />
                <span>All Tools</span>
              </Link>
            </>
          )}
          <span>·</span>
          <a
            href="https://github.com/berkekiran/buidl-now"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-foreground hover:opacity-50 transition-opacity"
            aria-label="GitHub Repository"
          >
            <FaGithub className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        </div>
      </div>

      {/* Desktop Footer - Left: Built by, Right: GitHub */}
      <div className="hidden lg:block fixed bottom-10 left-10 z-50">
        <span className="text-sm text-muted-foreground font-semibold" style={{ fontFamily: 'var(--font-turret), sans-serif' }}>
          Built by{" "}
          <a
            href="https://berkekiran.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:opacity-50 transition-opacity"
          >
            Berke
          </a>
        </span>
      </div>

      <div className="hidden lg:block fixed bottom-10 right-10 z-50">
        <a
          href="https://github.com/berkekiran/buidl-now"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-foreground hover:opacity-50 transition-opacity font-semibold"
          style={{ fontFamily: 'var(--font-turret), sans-serif' }}
          aria-label="GitHub Repository"
        >
          <FaGithub className="w-4 h-4" />
          <span>GitHub</span>
        </a>
      </div>
    </>
  );
}
