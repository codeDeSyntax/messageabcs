import Image from "next/image";

interface LogoProps {
  variant?: "default" | "compact";
  className?: string;
}

export const Logo = ({ variant = "default", className = "" }: LogoProps) => {
  // click logo function
  const handleClick = () => {
    // Navigate to home page
    window.location.href = "/";
  };

  if (variant === "compact") {
    return (
      <div
        className={`flex items-center gap-1.5 ${className}`}
        onClick={handleClick}
      >
        <Image
          src="/mabcs.png"
          alt="Message ABCs Logo"
          width={32}
          height={32}
          className="rounded-md"
        />
        <div className="h-8 w-px bg-primary/30" />
        <div className="flex flex-col leading-none -space-y-0.5">
          <span className="text-xs font-bold text-primary uppercase tracking-tight">
            Message
          </span>
          <span className="text-xs font-bold text-foreground uppercase tracking-tight">
            ABCS
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 cursor-pointer ${className}`}  onClick={handleClick}>
      <Image
        src="/mabcs.png"
        alt="Message ABCs Logo"
        width={40}
        height={40}
        className="rounded-md"
      />
      <div className="h-10 w-px bg-primary/30" />
      <div className="flex flex-col leading-none -space-y-1">
        <span className="text-base md:text-lg font-bold tracking-tight uppercase text-primary transition-colors duration-300">
          MESSAGE
        </span>
        <span className="text-base md:text-lg font-bold tracking-tight uppercase text-foreground transition-colors duration-300">
          ABCS
        </span>
      </div>
    </div>
  );
};
