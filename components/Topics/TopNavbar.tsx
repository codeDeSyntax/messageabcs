import { Logo } from "@/components/Logo";

export function TopNavbar() {
  return (
    <div className="hidden md:flex justify-end p-6 pb-2 relative z-10">
      <Logo />
    </div>
  );
}
