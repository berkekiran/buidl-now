import { FaGithub } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50">
      <div className="absolute bottom-0 left-0 right-0 z-0 h-16 w-full bg-gradient-to-t from-background via-background/75 to-transparent pointer-events-none"></div>
      <div className="relative z-10 max-w-[640px] w-full h-full mx-auto px-4 sm:px-6 pb-4 flex items-end justify-center">
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs text-muted-foreground text-center">
          <div className="flex flex-row items-center gap-1">
            <span className="font-medium">Buidl</span>
            <span className="font-normal italic">Now!</span>
          </div>
          <span className="font-normal hidden sm:inline">·</span>
          <span className="font-normal">Developer tools for builders who ship fast</span>
          <span className="font-normal hidden sm:inline">·</span>
          <a
            href="https://github.com/berkekiran/buidl-now"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-foreground hover:text-white transition-colors"
            aria-label="GitHub Repository"
          >
            <FaGithub className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
