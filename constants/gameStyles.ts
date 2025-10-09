/**
 * Game-Style UI Constants
 * Reusable Tailwind CSS class combinations for consistent game-like design
 */

// Base game-style button with gradient, shadows, and animations
export const GAME_BUTTON_BASE =
  "relative bg-gradient-to-b font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 rounded-lg game-button";

// Game-style button variants with different colors
export const GAME_BUTTON_VARIANTS = {
  primary: `${GAME_BUTTON_BASE} from-blue-400 to-blue-600 hover:from-blue-300 hover:to-blue-500 text-white border-blue-300/50`,
  secondary: `${GAME_BUTTON_BASE} from-gray-400 to-gray-600 hover:from-gray-300 hover:to-gray-500 text-white border-gray-300/50`,
  success: `${GAME_BUTTON_BASE} from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 text-white border-green-300/50`,
  danger: `${GAME_BUTTON_BASE} from-red-400 to-red-600 hover:from-red-300 hover:to-red-500 text-white border-red-300/50`,
  warning: `${GAME_BUTTON_BASE} from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-white border-yellow-300/50`,
};

// Small game-style button for mobile/compact areas
export const GAME_BUTTON_SMALL = {
  primary: `${GAME_BUTTON_VARIANTS.primary} hover:scale-110`,
  secondary: `${GAME_BUTTON_VARIANTS.secondary} hover:scale-110`,
  success: `${GAME_BUTTON_VARIANTS.success} hover:scale-110`,
  danger: `${GAME_BUTTON_VARIANTS.danger} hover:scale-110`,
  warning: `${GAME_BUTTON_VARIANTS.warning} hover:scale-110`,
};

// Game-style input field with inset/sunken effect - theme-aware
export const GAME_INPUT =
  " text-foreground backdrop-blur-sm rounded-lg transition-all duration-200 game-input border-2 " +
  "bg-gradient-to-b from-slate-200/60 to-slate-100/40 border-slate-300/80 shadow-inner " +
  "placeholder:text-slate-500/80 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:shadow-inner " +
  "hover:shadow-inner hover:from-slate-200/70 hover:to-slate-100/50 " +
  "dark:from-slate-800/60 dark:to-slate-900/80 dark:border-slate-600/60 dark:shadow-inner " +
  "dark:placeholder:text-slate-400/70 dark:focus:border-blue-400 dark:focus:ring-blue-400/20 " +
  "dark:hover:from-slate-800/70 dark:hover:to-slate-900/90";

// Game-style card with gradient background and hover effects
export const GAME_CARD_BASE =
  "relative overflow-hidden rounded-xl bg-gradient-to-br backdrop-blur-sm border-2 shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 cursor-pointer";

// Game-style card variants
export const GAME_CARD_VARIANTS = {
  primary: `${GAME_CARD_BASE} from-blue-900/30 to-blue-800/40 border-blue-400/30 hover:border-blue-300/50`,
  secondary: `${GAME_CARD_BASE} from-gray-900/30 to-gray-800/40 border-gray-400/30 hover:border-gray-300/50`,
  selected: `${GAME_CARD_BASE} from-blue-500/20 to-blue-600/30 border-blue-400/60 shadow-blue-400/20`,
};

// Shine overlay effect for buttons and cards
export const GAME_SHINE_OVERLAY =
  "absolute inset-0 bg-gradient-to-t from-transparent to-white/20 pointer-events-none";

// Game-style navigation/pagination buttons
export const GAME_NAV_BUTTON =
  "relative bg-gradient-to-b from-blue-500/80 to-blue-700/80 hover:from-blue-400/80 hover:to-blue-600/80 border-2 border-blue-300/50 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none rounded-lg game-button";

// Game-style floating action buttons
export const GAME_FAB = {
  edit: `${GAME_BUTTON_VARIANTS.primary} rounded-lg`,
  delete: `${GAME_BUTTON_VARIANTS.danger} rounded-lg`,
  close: `${GAME_BUTTON_VARIANTS.secondary} rounded-lg`,
};

// Game-style badge/tag
export const GAME_BADGE =
  "bg-gradient-to-r from-blue-500/80 to-blue-600/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md border border-blue-300/50 backdrop-blur-sm";

// Game-style avatar/image container
export const GAME_AVATAR =
  "relative rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg border-2 border-blue-300/50";

// Utility classes for z-index layering
export const GAME_Z_INDEX = {
  overlay: "z-10",
  content: "z-20",
  floating: "z-30",
  modal: "z-40",
  tooltip: "z-50",
};

// Animation keyframes for game-like effects
export const GAME_ANIMATIONS = {
  pulse: "animate-pulse",
  bounce: "animate-bounce",
  spin: "animate-spin",
  ping: "animate-ping",
};

// Rounded corner variations for different UI elements
export const GAME_ROUNDED = {
  small: "rounded-lg",
  medium: "rounded-xl",
  large: "rounded-2xl",
  full: "rounded-full",
  unique: "rounded-tl-2xl rounded-br-lg", // For special accent elements
};
