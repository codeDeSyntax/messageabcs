import { useTheme } from "next-themes";

export function ReadingBackground() {
  const { theme } = useTheme();

  // Theme-aware color generation
  const getThemeColors = () => {
    if (theme === "dark") {
      return {
        gradientFrom: "primary/10",
        gradientTo: "purple-900/10",
        meshFrom: "rgba(59, 130, 246, 0.15)",
        meshTo: "rgba(147, 51, 234, 0.15)",
      };
    } else {
      return {
        gradientFrom: "indigo-200/20",
        gradientTo: "violet-200/20",
        meshFrom: "rgba(99, 102, 241, 0.1)",
        meshTo: "rgba(139, 92, 246, 0.1)",
      };
    }
  };

  const colors = getThemeColors();

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
      {/* Base gradient background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-${colors.gradientFrom} to-${colors.gradientTo}`}
      />

      {/* Animated mesh gradient */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, ${colors.meshFrom} 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, ${colors.meshTo} 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, ${colors.meshFrom} 0%, transparent 50%),
            radial-gradient(circle at 90% 70%, ${colors.meshTo} 0%, transparent 50%),
            radial-gradient(circle at 10% 90%, ${colors.meshFrom} 0%, transparent 50%)
          `,
          animation: "meshFloat 20s ease-in-out infinite alternate",
        }}
      />

      {/* Secondary animated mesh */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at 60% 30%, ${colors.meshTo} 0%, transparent 40%),
            radial-gradient(circle at 30% 70%, ${colors.meshFrom} 0%, transparent 40%),
            radial-gradient(circle at 70% 90%, ${colors.meshTo} 0%, transparent 40%)
          `,
          animation: "meshFloat 25s ease-in-out infinite alternate-reverse",
        }}
      />

      {/* CSS animation styles are defined in the global CSS */}
    </div>
  );
}
