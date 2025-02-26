import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./ui/brand-logo";
import { useState, useEffect } from "react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={cn(
        "fixed top-0 w-full z-50",
        "transition-[background,backdrop-filter] duration-300 ease-out will-change-[background,backdrop-filter]",
        isScrolled 
          ? "bg-white/10 backdrop-blur-md" 
          : "bg-gradient-to-b from-black/30 via-black/10 to-transparent backdrop-blur-[2px]"
      )}
      style={{
        WebkitBackdropFilter: isScrolled ? "blur(8px)" : "blur(2px)",
      }}
    >
      {/* Glass overlay - single layer with transition */}
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-300 ease-out",
          isScrolled 
            ? "opacity-100 bg-gradient-to-b from-white/5 to-transparent" 
            : "opacity-0"
        )}
        style={{
          maskImage: "linear-gradient(to bottom, black, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent)"
        }}
      />
      
      <div className="max-w-[2000px] mx-auto px-12 sm:px-14 lg:px-16 relative">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <BrandLogo />
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className={cn(
                "transition-colors duration-200",
                "text-sm tracking-wide font-light",
                isScrolled
                  ? "text-white hover:text-white"
                  : "text-white/95 hover:text-white"
              )}>About</a>
              <a href="#" className={cn(
                "transition-colors duration-200",
                "text-sm tracking-wide font-light",
                isScrolled
                  ? "text-white hover:text-white"
                  : "text-white/95 hover:text-white"
              )}>Services</a>
              <a href="#" className={cn(
                "transition-colors duration-200",
                "text-sm tracking-wide font-light",
                isScrolled
                  ? "text-white hover:text-white"
                  : "text-white/95 hover:text-white"
              )}>Community</a>
              <a href="#" className={cn(
                "transition-colors duration-200",
                "text-sm tracking-wide font-light",
                isScrolled
                  ? "text-white hover:text-white"
                  : "text-white/95 hover:text-white"
              )}>Activated Entertainment</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div 
              className={cn(
                "flex items-center relative",
                "transition-all duration-300 ease-out",
                "rounded-full overflow-hidden",
                "w-64"
              )}
            >
              {/* Glass effect background */}
              <div className={cn(
                "absolute inset-0 transition-all duration-300 ease-out",
                isScrolled
                  ? "bg-white/5 backdrop-blur-[8px]"
                  : "bg-black/20 backdrop-blur-[2px]"
              )}
              style={{
                WebkitBackdropFilter: isScrolled ? "blur(8px)" : "blur(2px)",
              }}
              />
              
              {/* Content container */}
              <div className={cn(
                "flex items-center w-full h-full relative px-4 py-1.5",
                "transition-all duration-300 ease-out",
                isScrolled
                  ? "hover:bg-white/5"
                  : "hover:bg-black/30"
              )}>
                <Search className="w-5 h-5 text-white" />
                <input
                  type="text"
                  placeholder="Search..."
                  className={cn(
                    "bg-transparent outline-none ml-2",
                    "text-white placeholder:text-white/60",
                    "w-full text-sm font-light h-6"
                  )}
                />
              </div>
            </div>

            <button 
              className={cn(
                "px-4 py-2 rounded-full",
                "transition-[backdrop-filter,border,box-shadow] duration-300 ease-out",
                "bg-gradient-lotus text-white",
                "hover:shadow-lg hover:shadow-pantheon-pink/20",
                "active:scale-95",
                "text-sm tracking-wide",
                isScrolled 
                  ? "backdrop-blur-md border border-white/10"
                  : "backdrop-blur-sm"
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
