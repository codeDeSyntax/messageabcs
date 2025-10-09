/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  MoreHorizontal,
  Image as ImageIcon,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiService, BiblicalTopicWithCount } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { GAME_BUTTON_SMALL } from "@/constants/gameStyles";

// Backend BiblicalTopic with admin-specific fields
type AdminTopic = BiblicalTopicWithCount & {
  isActive: boolean;
};

interface TopicFormData {
  title: string;
  subtitle: string;
  scriptures: string[];
  mainExtract: string;
  quotes: string[];
  image: string;
}

const TopicsManager: React.FC = () => {
  const router = useRouter();
  const [topics, setTopics] = useState<AdminTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const { toast } = useToast();

  // Load topics from API
  useEffect(() => {
    fetchTopics();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTopicsWithQuestionCounts({
        page: 1,
        limit: 50,
      });

      if (response.success && response.data) {
        // Transform BiblicalTopicWithCount data to AdminTopic format
        const adminTopics = response.data.map((t) => ({
          ...t,
          isActive: true, // Default to active since no status field in public endpoint
        }));
        setTopics(adminTopics);
      } else {
        toast({
          title: "Error",
          description: "Failed to load topics",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
      toast({
        title: "Error",
        description: "Failed to load topics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to topics
  const filteredTopics = React.useMemo(() => {
    let filtered = topics;

    if (searchTerm) {
      filtered = filtered.filter(
        (topic) =>
          topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          topic.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          topic.mainExtract?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((topic) =>
        filterStatus === "active" ? topic.isActive : !topic.isActive
      );
    }

    return filtered;
  }, [topics, searchTerm, filterStatus]);

  const handleEdit = (topic: AdminTopic) => {
    router.push(`/admin/topics/edit/${topic.id}`);
  };

  const handleDelete = async (topicId: string) => {
    try {
      await apiService.deleteTopic(topicId);
      toast({
        title: "Success",
        description: "Topic deleted successfully",
      });
      // Refresh topics list
      fetchTopics();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete topic. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleTopicStatus = async (topicId: string) => {
    try {
      // Note: Backend doesn't support toggle status directly
      // This would need to be implemented as a full topic update
      toast({
        title: "Info",
        description: "Status toggle not implemented yet",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update topic status. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 space-y-6 pb-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="hidden md:block text-2xl font-heading font-bold text-foreground">
              Topics Management
            </h2>
            <p className="text-muted-foreground">
              Manage biblical topics and their content
            </p>
          </div>
          <button
            onClick={() => router.push("/admin/topics/new")}
            className={`${GAME_BUTTON_SMALL.primary} px-4 py-2 flex items-center gap-2`}
          >
            <Plus className="h-4 w-4" />
            Add Topic
          </button>
        </div>

        {/* Filters */}
        <Card className="bg-white/20 dark:bg-black/20 backdrop-blur-sm border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex flex-row sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background/50 border-blue-500/20 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select
                  value={filterStatus}
                  onValueChange={(value) =>
                    setFilterStatus(value as "all" | "active" | "inactive")
                  }
                >
                  <SelectTrigger className="w-40 bg-background/50 border-blue-500/20 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Topics</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="inactive">Inactive Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scrollable Topics Grid */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 pb-20">
          {loading
            ? // Loading Skeletons
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="h-24 md:h-52 rounded-lg overflow-hidden"
                >
                  <Skeleton className="h-full w-full" />
                </div>
              ))
            : filteredTopics.map((topic) => (
                <div key={topic.id}>
                  {/* Mobile Card Layout */}
                  <div className="relative group cursor-pointer transition-all duration-300 md:hidden h-24 rounded-lg border bg-card/20 flex items-center space-x-3 border-none hover:border-primary/30 shadow-sm">
                    {/* Mobile - Avatar Image */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-br-3xl overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-primary/20">
                        {topic.image ? (
                          <img
                            src={topic.image}
                            alt={topic.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mobile - Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-foreground leading-tight line-clamp-1 mb-1">
                        {topic.title}
                      </h3>
                      {topic.subtitle && (
                        <p className="text-sm text-muted-foreground leading-tight line-clamp-2">
                          {topic.subtitle}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          className={`${GAME_BUTTON_SMALL.primary} text-xs px-2 py-1 cursor-default`}
                        >
                          {topic.isActive ? "Active" : "Inactive"}
                        </button>
                        <button
                          className={`${GAME_BUTTON_SMALL.secondary} text-xs px-2 py-1 cursor-default`}
                        >
                          {topic.questionsCount} question
                          {topic.questionsCount !== 1 ? "s" : ""}
                        </button>
                      </div>
                    </div>

                    {/* Mobile - Action Buttons */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(topic);
                        }}
                        className="p-2 rounded-lg game-nav-button bg-blue-100/50 hover:bg-blue-200/50 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 transition-colors"
                        title="Edit topic"
                      >
                        <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 rounded-lg bg-gray-100/50 hover:bg-gray-200/50 dark:bg-gray-800/30 dark:hover:bg-gray-700/50 transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(topic)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="text-red-600 dark:text-red-400"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Topic
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  {' Are you sure you want to delete "' +
                                    topic.title +
                                    '"? This action cannot be undone.'}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(topic.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Desktop Card Layout - Original design for larger screens */}
                  <div className="hidden md:block">
                    <div
                      className="relative h-56 rounded-lg overflow-hidden group hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                      style={{
                        backgroundImage: `url(${topic.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      {/* Gradient overlay from middle to bottom */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/70 to-transparent"></div>

                      {/* Hover Edit Button */}
                      <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="flex gap-2">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(topic);
                            }}
                            className="w-8 h-8 rounded-full bg-blue-500/20 backdrop-blur-sm hover:bg-blue-600/90 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 shadow-lg"
                          >
                            <Edit className="h-4 w-4 text-white" />
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="w-8 h-8 rounded-full bg-blue-900/20  hover:bg-red-600/90 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 shadow-lg"
                              >
                                <Trash2 className="h-4 w-4 text-white" />
                              </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white/95 dark:bg-black/95 backdrop-blur-sm border-red-500/20">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Topic
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  {' Are you sure you want to delete "' +
                                    topic.title +
                                    '"? This action cannot be undone.'}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(topic.id)}
                                  className="bg-red-500 hover:bg-red-600 text-white"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="relative z-10 h-full flex flex-col justify-between p-4">
                        {/* Top section - now empty since buttons moved to hover area */}
                        <div className="flex justify-end"></div>

                        {/* Bottom section with content */}
                        <div className="space-y-3">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">
                              {topic.title}
                            </h3>
                            {topic.subtitle && (
                              <p className="text-sm text-white/80">
                                {topic.subtitle}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4 text-white/70" />
                                <button
                                  className={`${GAME_BUTTON_SMALL.secondary} text-xs px-2 py-1 cursor-default`}
                                >
                                  {topic.questionsCount || 0} questions
                                </button>
                              </div>
                              <button
                                className={`${
                                  topic.isActive
                                    ? GAME_BUTTON_SMALL.success
                                    : GAME_BUTTON_SMALL.secondary
                                } text-xs px-2 py-1 cursor-default`}
                              >
                                {topic.isActive ? "Active" : "Inactive"}
                              </button>
                            </div>
                          </div>

                          <div className="text-xs text-white/60">
                            Updated:{" "}
                            {new Date(topic.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Right Clipped Button */}
                      <div className="absolute bottom-0 right-0 z-20">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(topic);
                          }}
                          className={`relative game-nav-button   hover:bg-blue-600/95 text-blue-900 dark:text-blue-50  px-4 py-2 cursor-pointer transition-all duration-200 hover:scale-105 shadow-lg `}
                          style={{
                            clipPath:
                              "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            <span className="text-sm font-medium">View</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {!loading && filteredTopics.length === 0 && (
          <div className="p-12 text-center bg-white/5 dark:bg-black/5 rounded-lg">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No topics found
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filters"
                : "Create your first topic to get started"}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <button
                onClick={() => router.push("/admin/topics/new")}
                className={`${GAME_BUTTON_SMALL.primary} px-4 py-2 flex items-center gap-2`}
              >
                <Plus className="h-4 w-4" />
                Add Topic
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicsManager;
