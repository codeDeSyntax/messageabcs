import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  variant?: "default" | "compact";
  className?: string;
}

export const Logo = ({ variant = "default", className = "" }: LogoProps) => {
  if (variant === "compact") {
    return (
      <Link
        href="/"
        className={`inline-flex items-center gap-1.5 sm:gap-2 group transition-opacity hover:opacity-90 ${className}`}
      >
        <div className="relative w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 rounded-md sm:rounded-lg overflow-hidden border border-border/80 shadow-2xs">
          <Image
            src="/mabcs.png"
            alt="MessageABCs Logo"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex items-baseline gap-1 leading-none">
          <span className="font-serif font-medium text-xs sm:text-sm text-foreground tracking-tight">
            Message
          </span>
          <span className="hidden sm:inline font-sans font-medium text-[10.5px] sm:text-[11px] text-primary tracking-wide uppercase">
            ABCs
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 sm:gap-2.5 group transition-opacity hover:opacity-90 ${className}`}
    >
      <div className="relative w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0 rounded-md sm:rounded-lg overflow-hidden border border-border/80 shadow-2xs group-hover:border-primary/40 transition-colors">
        <Image
          src="/mabcs.png"
          alt="MessageABCs Logo"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex items-baseline gap-1 leading-none select-none">
        <span className="font-serif font-medium text-sm sm:text-[17px] text-foreground tracking-tight">
          Message
        </span>
        <span className="hidden sm:inline font-sans font-medium text-xs sm:text-[13px] text-primary tracking-wider uppercase">
          ABCs
        </span>
      </div>
    </Link>
  );
};

