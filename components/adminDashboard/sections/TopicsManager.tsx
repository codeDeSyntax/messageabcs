/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  MoreHorizontal,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAdminDashboard } from "@/contexts/AdminDashboardContext";
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
import {
  useAdminAllTopics,
  useDeleteTopic,
  useToggleTopicStatus,
} from "@/hooks/queries/useTopicsQuery";
import { EditTopicSidebar } from "./EditTopicSidebar";
import { NewTopicSidebar } from "./NewTopicSidebar";

type AdminTopic = BiblicalTopicWithCount & {
  isActive: boolean;
};

const TopicsManager: React.FC = () => {
  const router = useRouter();
  const { searchTerm, setSearchTerm } = useAdminDashboard();
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [editingSidebarOpen, setEditingSidebarOpen] = useState(false);
  const [newTopicSidebarOpen, setNewTopicSidebarOpen] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    data: topicsData,
    isLoading: loading,
    refetch: fetchTopics,
  } = useAdminAllTopics({
    page: 1,
    limit: 100,
  });

  const deleteTopicMutation = useDeleteTopic();
  const toggleStatusMutation = useToggleTopicStatus();

  const topics = React.useMemo<AdminTopic[]>(
    () =>
      topicsData?.data?.map((t) => ({
        ...t,
        isActive: t.isActive ?? true,
      })) || [],
    [topicsData],
  );

  const filteredTopics = React.useMemo(() => {
    let filtered = topics;

    if (searchTerm) {
      filtered = filtered.filter(
        (topic) =>
          topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          topic.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          topic.mainExtract?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((topic) =>
        filterStatus === "active" ? topic.isActive : !topic.isActive,
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

  const toggleTopicStatus = async (topicId: string, currentStatus: boolean) => {
    try {
      await toggleStatusMutation.mutateAsync(topicId);
      toast({
        title: "Success",
        description: `Topic ${currentStatus ? "hidden" : "shown"} successfully`,
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
    <div className="space-y-4 max-w-4xl pb-16">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-[var(--theme-text-primary)] tracking-tight">
            Topics Management
          </h2>
          <p className="text-xs md:text-sm text-[var(--theme-text-secondary)] mt-0.5">
            Create, update, and manage biblical study topics and extracts
          </p>
        </div>

        <button
          onClick={() => setNewTopicSidebarOpen(true)}
          className="self-start sm:self-auto bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-[var(--theme-primary-fg)] px-4 py-2 rounded-2xl flex items-center gap-1.5 text-xs font-semibold transition-all h-9 shadow-none"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Topic</span>
        </button>
      </div>

      {/* Main Space Search & Filter Bar - Clean Borderless */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--theme-text-secondary)]/70 z-10" />
          <Input
            placeholder="Search topics by title, subtitle, or extracts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 rounded-2xl border-0 bg-[var(--theme-surface)] text-sm placeholder:text-[var(--theme-text-secondary)]/60 focus:bg-[var(--theme-surface-subtle)] focus:ring-1 focus:ring-[var(--theme-primary)] transition-all shadow-none w-full text-[var(--theme-text-primary)]"
          />
        </div>

        <Select
          value={filterStatus}
          onValueChange={(value) =>
            setFilterStatus(value as "all" | "active" | "inactive")
          }
        >
          <SelectTrigger className="w-full sm:w-40 bg-[var(--theme-surface)] border-0 rounded-2xl text-xs font-medium text-[var(--theme-text-dark)] h-10 shadow-none">
            <Filter className="h-3.5 w-3.5 mr-2 text-[var(--theme-text-secondary)]" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[var(--theme-canvas)] border-0 rounded-xl shadow-lg">
            <SelectItem value="all">All Topics</SelectItem>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="inactive">Hidden Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Google Settings Style Grouped Container - Borderless, Canvas Integrated */}
      <div className="rounded-2xl overflow-hidden divide-y divide-[var(--theme-border-subtle)]/60">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2.5">
              <div className="flex items-center gap-3 w-full">
                <Skeleton className="h-9 w-9 rounded-xl flex-shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            </div>
          ))
        ) : filteredTopics.length === 0 ? (
          <div className="p-8 text-center text-[var(--theme-text-secondary)] text-sm">
            No topics found matching your search.
          </div>
        ) : (
          filteredTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => handleEdit(topic)}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-[var(--theme-surface)]/60 cursor-pointer transition-all duration-150 rounded-xl group gap-3"
            >
              {/* Left: Thumbnail & Content */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl overflow-hidden bg-[var(--theme-surface-subtle)] text-[var(--theme-accent)] flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {topic.image ? (
                    <img
                      src={topic.image}
                      alt={topic.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="h-4.5 w-4.5" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[var(--theme-text-primary)] group-hover:text-[var(--theme-text-dark)] truncate">
                      {topic.title}
                    </h3>
                    {!topic.isActive && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[var(--theme-badge-bg)] text-[var(--theme-badge-text)]">
                        Hidden
                      </span>
                    )}
                  </div>
                  {topic.subtitle && (
                    <p className="text-xs text-[var(--theme-text-secondary)] truncate mt-0.5">
                      {topic.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Actions Menu & Chevron */}
              <div
                className="flex items-center gap-2 flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="p-1.5 rounded-xl hover:bg-[var(--theme-surface-subtle)] text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] transition-colors"
                      title="More actions"
                      aria-label="More actions"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 bg-[var(--theme-canvas)] border-0 rounded-xl shadow-lg"
                  >
                    <DropdownMenuItem
                      onClick={() => toggleTopicStatus(topic.id, topic.isActive)}
                      className="cursor-pointer text-[var(--theme-text-primary)] focus:bg-[var(--theme-surface)]"
                    >
                      {topic.isActive ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-2 text-[var(--theme-text-secondary)]" />
                          <span>Hide Topic</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2 text-emerald-600" />
                          <span>Show Topic</span>
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleEdit(topic)}
                      className="cursor-pointer text-[var(--theme-text-primary)] focus:bg-[var(--theme-surface)]"
                    >
                      <Edit className="h-4 w-4 mr-2 text-[var(--theme-primary)]" />
                      <span>Edit Topic</span>
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          <span>Delete Topic</span>
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-[90vw] sm:max-w-md bg-[var(--theme-canvas)] border-0 rounded-2xl shadow-xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-[var(--theme-text-primary)]">Delete Topic</AlertDialogTitle>
                          <AlertDialogDescription className="text-[var(--theme-text-secondary)]">
                            Are you sure you want to delete &quot;{topic.title}&quot;? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-2">
                          <AlertDialogCancel className="rounded-xl border-0 bg-[var(--theme-surface)] text-[var(--theme-text-primary)]">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(topic.id)}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div
                  onClick={() => handleEdit(topic)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--theme-text-secondary)]/60 group-hover:text-[var(--theme-text-primary)] group-hover:bg-[var(--theme-surface-subtle)] transition-all cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Topic Sidebar Drawer */}
      <EditTopicSidebar
        isOpen={editingSidebarOpen}
        onClose={() => setEditingSidebarOpen(false)}
        topicId={selectedTopicId}
        onSuccess={handleEditSuccess}
      />

      {/* New Topic Sidebar Drawer */}
      <NewTopicSidebar
        isOpen={newTopicSidebarOpen}
        onClose={() => setNewTopicSidebarOpen(false)}
        onSuccess={handleNewTopicSuccess}
      />
    </div>
  );
};

export default TopicsManager;
