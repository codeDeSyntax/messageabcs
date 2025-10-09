// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { NavigationDrawer } from "@/components/NavigationDrawer";
// import { BottomNavigation } from "@/components/BottomNavigation";
// import { AnimatedBackground } from "@/components/AnimatedBackground";
// import { ProfileCard } from "@/components/ProfileCard";
// import { TopicActionButtons } from "@/components/TopicActionButtons";
// import { TopicGridSkeleton } from "@/components/LoadingSkeleton";
// import { LoadingFailedIcon } from "@/components/LoadingFailedIcon";
// import { useTheme } from "next-themes";
// import { Button } from "@/components/ui/button";
// import { Plus, AlertCircle, RefreshCw, LayoutGrid, List } from "lucide-react";
// import { useAuth } from "@/hooks/useAuth";
// import { useTopics } from "@/hooks/useTopics";
// import {
//   GAME_BUTTON_VARIANTS,
//   GAME_SHINE_OVERLAY,
//   GAME_ROUNDED,
//   GAME_Z_INDEX,
// } from "@/constants/gameStyles";

// // Import image
// import communityReadingImage from "@/assets/community-reading.jpg";

// // Import modular components
// import { TopNavbar } from "./TopNavbar";
// import { SearchAndPagination } from "./SearchAndPagination";
// import { TopicCard } from "./TopicCard";
// import { NoResults } from "./NoResults";

// export default function Topics() {
//   const router = useRouter();
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

//   const { theme } = useTheme();
//   const { isAuthenticated } = useAuth();

//   // Use the custom hook for topics data management
//   const {
//     topics: paginatedTopics,
//     loading,
//     error,
//     totalPages,
//     currentPage,
//     searchQuery,
//     setCurrentPage,
//     setSearchQuery,
//     refetch,
//   } = useTopics({ itemsPerPage: 8 });

//   return (
//     <div className="h-screen overflow-hidden relative ">
//       {/* <AnimatedBackground /> */}
//       {/* white blur over animation background  */}
//       {/* <div className="bg-blue-50/20 backdrop-blur-md dark:bg-gray-900 dark:backdrop-blur-sm inset-0 absolute" /> */}
//       {/* Mobile Navigation Drawer with MESSAGEABCS logo */}
//       <div className="md:hidden py-2 px-6 pb-2 relative z-10 flex justify-between items-center">
//         <NavigationDrawer
//           isOpen={isDrawerOpen}
//           onOpenChange={setIsDrawerOpen}
//         />
//         <div
//           className="select-none cursor-default text-base font-bold tracking-wider uppercase"
//           style={{
//             background:
//               "linear-gradient(135deg, #3b82f6 0%, #9333ea 50%, #ec4899 100%)",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//             backgroundClip: "text",
//             textShadow: `0px 0px 0 rgb(59,130,246),
//              1px 1px 0 rgb(54,125,241),
//              2px 2px 0 rgb(49,120,236),
//              3px 3px 0 rgb(44,115,231),
//              4px 4px 0 rgb(39,110,226),
//              5px 5px 0 rgb(34,105,221)`,
//             fontWeight: 700,
//             letterSpacing: "0.15em",
//           }}
//         >
//           MESSAGE
//           <span
//             className="text-white"
//             style={{
//               color: "white",
//               textShadow: `0px 0px 0 rgb(252, 252, 252),
//                1px 1px 0 rgb(253, 253, 253),
//                2px 2px 0 rgb(252, 252, 253),
//                3px 3px 0 rgb(44,115,231),
//                4px 4px 0 rgb(39,110,226),
//                5px 5px 0 rgb(249, 249, 249)`,
//             }}
//           >
//             ABCS
//           </span>
//         </div>
//       </div>

//       {/* Main Content Panel - Split Layout */}
//       <div className="flex justify-center h-full m-2 md:m-0 p-3 sm:p-0 pt-2 md:pt-0 relative z-10">
//         <div className="w-full max-w-7xl h-full ">
//           {/* Mobile: Single Panel Layout */}
          
//           <div className="md:hidden w-full border-none bg-blue-50/20  dark:bg-gray-900 dark:border-blue-500 border-blue-500 rounded-2xl flex flex-col h-[95%] overflow-hidden">
//             {/* Fixed Search Bar and Pagination within panel */}
//             <div className="sticky top-0 z-10 bg-transparent backdrop-blur-md border-b border-white/10 dark:border-blue-500/20 p-0 sm:p-4 rounded-t-2xl">
//               {/* Mobile: Stacked layout */}
//               <div className="space-y-4">
//                 <div className="flex items-center w-  justify-between ">
//                   <SearchAndPagination
//                     searchQuery={searchQuery}
//                     onSearchChange={setSearchQuery}
//                     currentPage={currentPage}
//                     totalPages={totalPages}
//                     onPageChange={setCurrentPage}
//                   />
//                   {/* <h3 className="text-lg font-semibold truncate text-foreground">
//                     Topics {!loading && `(${paginatedTopics.length})`}
//                   </h3> */}
//                 </div>
//               </div>
//             </div>

//             {/* Mobile Scrollable Content Area */}
//             <div className="flex-1 overflow-y-auto no-scrollbar  sm:p-4 sm:px-6 pt-0">
//               <div className="mt-4">
//                 {/* Loading State */}
//                 {loading && (
//                   <div className="pb-40">
//                     <TopicGridSkeleton count={8} viewMode="grid" />
//                   </div>
//                 )}

//                 {/* Error State */}
//                 {error && !loading && (
//                   <div className="flex flex-col items-center justify-center py-16 text-center px-4">
//                     <LoadingFailedIcon className="h-20 w-20 mb-6" />
//                     <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
//                       Oops! Something went wrong
//                     </h3>
//                     <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm text-sm leading-relaxed">
//                       {" We couldn't load the biblical topics. Please check your connection and try again."}
//                     </p>
//                     <Button
//                       onClick={() => refetch()}
//                       className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
//                     >
//                       <RefreshCw className="h-4 w-4 mr-2" />
//                       Try Again
//                     </Button>
//                     <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
//                       Error: {error}
//                     </p>
//                   </div>
//                 )}

//                 {/* Mobile Content Grid */}
//                 {!loading && !error && (
//                   <div className="pb-40">
//                     {paginatedTopics.length > 0 ? (
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 w-full">
//                         {paginatedTopics.map((topic) => (
//                           <TopicCard
//                             key={topic.id}
//                             topic={topic}
//                             viewMode="grid"
//                           />
//                         ))}
//                       </div>
//                     ) : (
//                       <NoResults />
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Desktop: Board-style Grid Layout */}
//           <div className="hidden md:block h-[100%] bg-blue-50/20 dark:bg-black/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl overflow-hidden shadow-2xl">
//             {/* Header Section */}
//             <div className="sticky top-0 z-10 bg-blue-50/80 dark:bg-black/20 backdrop-blur-md border-b border-gray-200/50 dark:border-blue-500/20 p-3 px-6">
//               {/* Top Row: Logo and Profile */}

//               {/* Second Row: Title and Search */}
//               <div className="flex items-center justify-between gap-4">
//                 <div className="flex items-center gap-3">
//                   <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
//                     Biblical Topics
//                   </h1>
//                   <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
//                     <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
//                       {!loading ? paginatedTopics.length : 0} Topics
//                     </span>
//                   </div>
//                 </div>

//                 <div className="flex w- items-center gap-4">
//                   <SearchAndPagination
//                     searchQuery={searchQuery}
//                     onSearchChange={setSearchQuery}
//                     currentPage={currentPage}
//                     totalPages={totalPages}
//                     onPageChange={setCurrentPage}
//                   />

//                   <div className="flex gap-2">
//                     {/* View Toggle */}
//                     <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg p-1">
//                       <button
//                         onClick={() => setViewMode("grid")}
//                         className={`p-2 rounded transition-colors ${
//                           viewMode === "grid"
//                             ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
//                             : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//                         }`}
//                         title="Grid View"
//                       >
//                         <LayoutGrid className="h-4 w-4" />
//                       </button>
//                       <button
//                         onClick={() => setViewMode("list")}
//                         className={`p-2 rounded transition-colors ${
//                           viewMode === "list"
//                             ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
//                             : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//                         }`}
//                         title="List View"
//                       >
//                         <List className="h-4 w-4" />
//                       </button>
//                     </div>
//                     {/* <Button variant="outline" size="sm" className="h-9 w-9 p-0">
//                       <Plus className="h-4 w-4" />
//                     </Button> */}
//                     <ProfileCard />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Main Content Grid */}
//             <div className="flex-1 overflow-y-auto p-6 pt-4">
//               {/* Loading State */}
//               {loading && <TopicGridSkeleton count={8} viewMode={viewMode} />}

//               {/* Error State */}
//               {error && !loading && (
//                 <div className="flex flex-col items-center justify-center py-24 text-center px-4">
//                   <LoadingFailedIcon className="h-24 w-24 mb-8" />
//                   <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
//                     Oops! Something went wrong
//                   </h3>
//                   <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md text-base leading-relaxed">
//                    {" We couldn't load the biblical topics. Please check your internet connection and try again."}
//                   </p>
//                   <Button
//                     onClick={() => refetch()}
//                     className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
//                   >
//                     <RefreshCw className="h-5 w-5 mr-2" />
//                     Try Again
//                   </Button>
//                   <div className="mt-6 text-xs text-gray-500 dark:text-gray-500 max-w-lg">
//                     <details className="cursor-pointer">
//                       <summary className="hover:text-gray-600 dark:hover:text-gray-400">
//                         Technical details
//                       </summary>
//                       <p className="mt-2 text-left bg-gray-50 dark:bg-gray-800 p-3 rounded-md border">
//                         {error}
//                       </p>
//                     </details>
//                   </div>
//                 </div>
//               )}

//               {/* Success State - Topic Grid/List */}
//               {!loading && !error && (
//                 <div className="pb-40">
//                   {paginatedTopics.length > 0 ? (
//                     <div
//                       className={`${
//                         viewMode === "grid"
//                           ? "w-[80%] m-auto grid grid-cols-1  lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-3 auto-rows-fr"
//                           : "space-y-3"
//                       }`}
//                     >
//                       {paginatedTopics.map((topic) => (
//                         <TopicCard
//                           key={topic.id}
//                           topic={topic}
//                           viewMode={viewMode}
//                         />
//                       ))}
//                     </div>
//                   ) : (
//                     <NoResults />
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Add Fraying Effect Styles */}
//       <style
//         dangerouslySetInnerHTML={{
//           __html: `
//           /* Fraying Edge Effects */
//           .fraying-mask-right {
//             -webkit-mask-image: 
//               radial-gradient(circle at 95% 20%, transparent 8px, black 12px),
//               radial-gradient(circle at 90% 35%, transparent 6px, black 10px),
//               radial-gradient(circle at 97% 50%, transparent 10px, black 14px),
//               radial-gradient(circle at 92% 65%, transparent 7px, black 11px),
//               radial-gradient(circle at 96% 80%, transparent 9px, black 13px),
//               radial-gradient(circle at 88% 15%, transparent 5px, black 9px),
//               radial-gradient(circle at 94% 45%, transparent 8px, black 12px),
//               radial-gradient(circle at 91% 75%, transparent 6px, black 10px),
//               linear-gradient(to right, black 85%, transparent 100%);
//             mask-image: 
//               radial-gradient(circle at 95% 20%, transparent 8px, black 12px),
//               radial-gradient(circle at 90% 35%, transparent 6px, black 10px),
//               radial-gradient(circle at 97% 50%, transparent 10px, black 14px),
//               radial-gradient(circle at 92% 65%, transparent 7px, black 11px),
//               radial-gradient(circle at 96% 80%, transparent 9px, black 13px),
//               radial-gradient(circle at 88% 15%, transparent 5px, black 9px),
//               radial-gradient(circle at 94% 45%, transparent 8px, black 12px),
//               radial-gradient(circle at 91% 75%, transparent 6px, black 10px),
//               linear-gradient(to right, black 85%, transparent 100%);
//             -webkit-mask-composite: intersect;
//             mask-composite: intersect;
//           }

//           .fraying-image {
//             filter: contrast(1.1) saturate(1.2);
//             transition: all 0.3s ease;
//           }

//           .fraying-image:hover {
//             filter: contrast(1.15) saturate(1.3);
//             transform: scale(1.02);
//           }

//           /* Subtle animation for fraying edges */
//           @keyframes frayingMotion {
//             0%, 100% { 
//               -webkit-mask-position: 0% 0%, 2% 5%, -1% 3%, 1% -2%, -2% 1%, 3% -1%, -1% 2%, 2% -3%, 0% 0%;
//               mask-position: 0% 0%, 2% 5%, -1% 3%, 1% -2%, -2% 1%, 3% -1%, -1% 2%, 2% -3%, 0% 0%;
//             }
//             50% { 
//               -webkit-mask-position: 1% 2%, -1% -2%, 2% -1%, -2% 3%, 1% -1%, -3% 2%, 2% -1%, -1% 2%, 0% 0%;
//               mask-position: 1% 2%, -1% -2%, 2% -1%, -2% 3%, 1% -1%, -3% 2%, 2% -1%, -1% 2%, 0% 0%;
//             }
//           }

//           .fraying-mask-right {
//             animation: frayingMotion 8s ease-in-out infinite;
//           }

//           /* Additional organic texture overlay */
//           .fraying-mask-right::before {
//             content: '';
//             position: absolute;
//             inset: 0;
//             background: 
//               radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 1px, transparent 2px),
//               radial-gradient(circle at 70% 40%, rgba(255,255,255,0.08) 1px, transparent 2px),
//               radial-gradient(circle at 20% 60%, rgba(255,255,255,0.12) 1px, transparent 2px),
//               radial-gradient(circle at 80% 80%, rgba(255,255,255,0.09) 1px, transparent 2px);
//             background-size: 20px 20px, 25px 25px, 30px 30px, 35px 35px;
//             pointer-events: none;
//             mix-blend-mode: soft-light;
//             opacity: 0.6;
//           }

//           /* Enhanced edge bleeding effect */
//           .fraying-mask-right::after {
//             content: '';
//             position: absolute;
//             top: 0;
//             right: -20px;
//             width: 40px;
//             height: 100%;
//             background: linear-gradient(to right, 
//               rgba(var(--background), 0) 0%,
//               rgba(var(--background), 0.1) 30%,
//               rgba(var(--background), 0.3) 60%,
//               rgba(var(--background), 0.6) 80%,
//               rgba(var(--background), 0.9) 100%
//             );
//             filter: blur(2px);
//             pointer-events: none;
//           }
//           }
//           `,
//         }}
//       />

//       {/* Desktop Navigation */}
//       <div className="relative z-10">
//         <BottomNavigation />
//       </div>

//       {/* Topic Action Buttons */}
//       <TopicActionButtons />
//     </div>
//   );
// }
