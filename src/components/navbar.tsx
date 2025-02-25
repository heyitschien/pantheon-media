import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./ui/brand-logo";
import { useState } from "react";

export function Navbar() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-white/70 dark:bg-pantheon-night/70 backdrop-blur-md shadow-sm border-b border-white/10 dark:border-pantheon-night/10">
      <div className="max-w-[2000px] mx-auto px-12 sm:px-14 lg:px-16">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <BrandLogo />
            <div className="hidden md:flex items-center gap-6">
              <a href="#" className="text-pantheon-night/80 dark:text-white/80 hover:text-pantheon-purple dark:hover:text-pantheon-purple transition-colors font-medium">About</a>
              <a href="#" className="text-pantheon-night/80 dark:text-white/80 hover:text-pantheon-purple dark:hover:text-pantheon-purple transition-colors font-medium">Services</a>
              <a href="#" className="text-pantheon-night/80 dark:text-white/80 hover:text-pantheon-purple dark:hover:text-pantheon-purple transition-colors font-medium">Community</a>
              <a href="#" className="text-pantheon-night/80 dark:text-white/80 hover:text-pantheon-purple dark:hover:text-pantheon-purple transition-colors font-medium">Activated Entertainment</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={cn(
              "flex items-center transition-all duration-300 ease-in-out",
              "bg-white/20 dark:bg-pantheon-night/30 hover:bg-white/30 dark:hover:bg-pantheon-night/50 rounded-full backdrop-blur-sm border border-white/10 dark:border-pantheon-night/10",
              isSearchExpanded ? "w-64 px-4" : "w-10 px-2"
            )}>
              <button 
                className="text-pantheon-night/80 dark:text-white/80 hover:text-pantheon-purple dark:hover:text-pantheon-purple transition-colors p-2"
                onClick={() => setIsSearchExpanded(true)}
              >
                <Search className="w-5 h-5" />
              </button>
              <input
                type="text"
                placeholder="Search..."
                className={cn(
                  "bg-transparent text-pantheon-night dark:text-white outline-none w-full transition-all duration-300",
                  "placeholder:text-pantheon-night/50 dark:placeholder:text-white/50",
                  isSearchExpanded ? "ml-2 opacity-100" : "w-0 opacity-0"
                )}
                onBlur={() => setIsSearchExpanded(false)}
              />
            </div>
            <button 
              className={cn(
                "px-4 py-2 rounded-full font-medium transition-all duration-300",
                "bg-gradient-lotus text-white",
                "hover:shadow-lg hover:shadow-pantheon-pink/20",
                "active:scale-95",
                "backdrop-blur-sm border border-white/10"
              )}
            >
              BOOK A CALL
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
