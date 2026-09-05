import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  variant?: "default" | "compact";
  className?: string;
}

export const Logo = ({ variant = "default", className = "" }: LogoProps) => {
  const isCompact = variant === "compact";
  const imgDimension = isCompact ? 24 : 28;
  const sizeClass = isCompact ? "w-6 h-6 min-w-6 min-h-6 max-w-6 max-h-6" : "w-7 h-7 min-w-7 min-h-7 max-w-7 max-h-7";
  const textSizeClass = isCompact ? "text-sm" : "text-base";
  const badgeSizeClass = isCompact ? "text-[10px]" : "text-xs";
  const gapClass = isCompact ? "gap-2" : "gap-2.5";

  return (
    <Link
      href="/"
      className={`inline-flex flex-row items-center flex-nowrap shrink-0 whitespace-nowrap select-none group transition-opacity hover:opacity-90 ${gapClass} ${className}`}
      style={{
        display: "inline-flex",
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "nowrap",
        whiteSpace: "nowrap",
      }}
    >
      <div
        className={`relative ${sizeClass} shrink-0 rounded-lg overflow-hidden border border-border/80 shadow-2xs group-hover:border-primary/40 transition-colors`}
        style={{
          flexShrink: 0,
          width: `${imgDimension}px`,
          height: `${imgDimension}px`,
          minWidth: `${imgDimension}px`,
          minHeight: `${imgDimension}px`,
        }}
      >
        <Image
          src="/mabcs.png"
          alt="MessageABCs Logo"
          width={imgDimension}
          height={imgDimension}
          priority
          className="object-cover w-full h-full block"
        />
      </div>
      <span
        className={`font-serif font-medium ${textSizeClass} text-foreground tracking-tight inline-flex flex-row items-baseline flex-nowrap shrink-0 whitespace-nowrap leading-none`}
        style={{
          display: "inline-flex",
          flexDirection: "row",
          alignItems: "baseline",
          flexWrap: "nowrap",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        <span className="whitespace-nowrap shrink-0">Message</span>
        <span
          className={`font-sans font-bold ${badgeSizeClass} text-primary ml-1 tracking-wider uppercase inline-block whitespace-nowrap shrink-0`}
          style={{
            display: "inline-block",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          ABCs
        </span>
      </span>
    </Link>
  );
};

