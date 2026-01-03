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
import { BiblicalTopicWithCount } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { GAME_BUTTON_SMALL } from "@/constants/gameStyles";
import { useTopicsWithQuestionCounts, useDeleteTopic } from "@/hooks/queries";
import { EditTopicSidebar } from "./EditTopicSidebar";
import { NewTopicSidebar } from "./NewTopicSidebar";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [editingSidebarOpen, setEditingSidebarOpen] = useState(false);
  const [newTopicSidebarOpen, setNewTopicSidebarOpen] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const { toast } = useToast();

  // Use TanStack Query for topics
  const {
    data: topicsData,
    isLoading: loading,
    refetch: fetchTopics,
  } = useTopicsWithQuestionCounts({
    page: 1,
    limit: 50,
  });

  // Use TanStack Query mutation for deleting topic
  const deleteTopicMutation = useDeleteTopic();

  // Memoize topics to prevent unnecessary recalculations
  const topics = React.useMemo<AdminTopic[]>(
    () =>
      topicsData?.data?.map((t) => ({
        ...t,
        isActive: true, // Default to active since no status field in public endpoint
      })) || [],
    [topicsData]
  );

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
    setSelectedTopicId(topic.id);
    setEditingSidebarOpen(true);
  };

  const handleEditSuccess = () => {
    fetchTopics();
    toast({
      title: "Success",
      description: "Topic updated successfully",
    });
  };

  const handleNewTopicSuccess = () => {
    fetchTopics();
    toast({
      title: "Success",
      description: "Topic created successfully",
    });
  };

  const handleDelete = async (topicId: string) => {
    try {
      await deleteTopicMutation.mutateAsync(topicId);
      toast({
        title: "Success",
        description: "Topic deleted successfully",
      });
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
    <div className="h-full flex flex-col overflow-hidden">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 space-y-3 md:space-y-4 pb-4 md:pb-6">
        {/* Header */}
        <div className="flex flex-col gap-3 md:gap-4">
          {/* Title - Hidden on mobile as it's in top nav */}
          <div className="hidden md:block">
            <h2 className="text-2xl  font-medium text-foreground">
              Topics Management
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage biblical topics and their content
            </p>
          </div>

          {/* Search and Filter Row */}
          <div className="flex flex-col md:flex-row gap-2">
            {/* Search Input - Full width on mobile */}
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 flex-shrink-0" />
                <Input
                  placeholder="Search topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 bg-primary/10 border-none rounded-full focus:ring-2 focus:ring-primary/30 shadow-sm h-10 text-sm"
                />
              </div>
            </div>

            {/* Filter and Add Button Row */}
            <div className="flex gap-2 w-full">
              <Select
                value={filterStatus}
                onValueChange={(value) =>
                  setFilterStatus(value as "all" | "active" | "inactive")
                }
              >
                <SelectTrigger className="flex-1 min-w-0 bg-primary/10 border-none rounded-full focus:ring-2 focus:ring-primary/30 shadow-sm h-10 text-sm">
                  <Filter className="h-4 w-4 mr-1 sm:mr-2 flex-shrink-0" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>

              <button
                onClick={() => setNewTopicSidebarOpen(true)}
                className="flex-shrink-0 bg-primary hover:bg-accent text-primary-foreground px-2 sm:px-3 md:px-4 py-2 rounded-full flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md transition-all h-10 min-w-[40px]"
              >
                <Plus className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap text-sm">
                  Add Topic
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {/* <Card className="bg-background/20 backdrop-blur-sm border-border>
          <CardContent className="p-4">
            <div className="flex flex-row sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-primary/15 focus:ring-2 focus:ring-primary/30 focus:border-primary"
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
                  <SelectTrigger className="w-40 bg-primary/15 focus:ring-2 focus:ring-primary/30 focus:border-primary">
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
        </Card> */}
      </div>

      {/* Scrollable Topics Grid */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-2">
        <div className="max-w-4xl mx-auto space-y-3 pb-20">
          {loading
            ? // Loading Skeletons
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="h-20 rounded-xl overflow-hidden"
                >
                  <Skeleton className="h-full w-full" />
                </div>
              ))
            : filteredTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="flex items-start gap-0 p-0 bg-primary/10 rounded-xl border-none hover:shadow-md hover:shadow-primary/10 transition-all duration-200 cursor-pointer group  w-full relative"
                  onClick={() => handleEdit(topic)}
                >
                  {/* Left: Square Image - Smaller on mobile */}
                  <div className="flex-shrink-0 w-20 sm:w-24 md:w-32 h-full rounded-l-xl overflow-hidden bg-muted">
                    {topic.image ? (
                      <img
                        src={topic.image}
                        alt={topic.title}
                        className="w-full h-full object-fit"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Center: Title and Subtitle */}
                  <div className="flex-1 min-w-0 p-2 sm:p-3 md:p-4">
                    <h3 className="text-sm sm:text-base font-semibold text-foreground line-clamp-3 mb-1 sm:mb-2">
                      {topic.title}
                    </h3>
                    {topic.subtitle && (
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 sm:line-clamp-2">
                        {topic.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Right: Actions Menu */}
                  <div className="flex-shrink-0 absolute right-2 bottom-2 flex items-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-lg bg-muted hover:bg-primary/20 transition-colors"
                          title="More actions"
                          aria-label="More actions"
                        >
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 bg-cream-200"
                      >
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(topic);
                          }}
                          className="cursor-pointer"
                        >
                          <Edit className="h-4 w-4 mr-2 text-primary" />
                          <span>Edit Topic</span>
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onClick={(e) => e.stopPropagation()}
                              className="cursor-pointer text-red-600 focus:text-red-600"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              <span>Delete Topic</span>
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="max-w-[90vw] sm:max-w-md rounded-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Topic</AlertDialogTitle>
                              <AlertDialogDescription>
                                {' Are you sure you want to delete "' +
                                  topic.title +
                                  '"? This action cannot be undone.'}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                              <AlertDialogCancel className="rounded-xl">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(topic.id)}
                                className="bg-red-600 hover:bg-red-700 rounded-xl"
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
              ))}
        </div>

        {!loading && filteredTopics.length === 0 && (
          <div className="p-8 md:p-12 text-center bg-background/5 rounded-2xl mx-2 md:mx-0">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
              No topics found
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filters"
                : "Create your first topic to get started"}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <button
                onClick={() => setNewTopicSidebarOpen(true)}
                className="bg-primary hover:bg-accent text-primary-foreground px-4 py-2 rounded-xl flex items-center gap-2 mx-auto shadow-sm hover:shadow-md transition-all"
              >
                <Plus className="h-4 w-4" />
                Add Topic
              </button>
            )}
          </div>
        )}
      </div>

      {/* Edit Topic Sidebar */}
      <EditTopicSidebar
        isOpen={editingSidebarOpen}
        onClose={() => setEditingSidebarOpen(false)}
        topicId={selectedTopicId}
        onSuccess={handleEditSuccess}
      />

      {/* New Topic Sidebar */}
      <NewTopicSidebar
        isOpen={newTopicSidebarOpen}
        onClose={() => setNewTopicSidebarOpen(false)}
        onSuccess={handleNewTopicSuccess}
      />
    </div>
  );
};

export default TopicsManager;
