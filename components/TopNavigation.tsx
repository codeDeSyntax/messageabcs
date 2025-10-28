import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Hash,
  BookOpen,
  MessageCircleQuestion,
  MessageCircle,
} from "lucide-react";
import { Logo } from "@/components/Logo";

const navLinks = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Hash, label: "Topics", path: "/topics" },
  { icon: BookOpen, label: "Reading", path: "/reading" },
  { icon: MessageCircleQuestion, label: "Q&A", path: "/qa" },
  { icon: MessageCircle, label: "Ask", path: "/ask-question" },
];

export function TopNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 bg-white/80 dark:bg-black/60 backdrop-blur-md border-b border-blue-100 dark:border-blue-900/30 sticky top-0 z-30">
      <Logo />
      <ul className="flex gap-4 md:gap-6 items-center">
        {navLinks.map(({ icon: Icon, label, path }) => (
          <li key={path}>
            <button
              className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors duration-150 hover:bg-blue-100/60 dark:hover:bg-blue-900/30 focus:outline-none ${
                pathname === path
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                  : "text-gray-700 dark:text-gray-200"
              }`}
              onClick={() => router.push(path)}
            >
              <Icon className="h-4 w-4 mr-1" />
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
