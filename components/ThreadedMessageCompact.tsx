import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Reply,
  Send,
  ChevronDown,
  ChevronRight,
  CornerDownRight,
} from "lucide-react";
import { ThreadedMessage, AuthorType } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";

interface ThreadedMessageProps {
  message: ThreadedMessage;
  onReply?: (parentId: string, content: string, author: string) => void;
  onUpdate?: () => void;
  maxDepth?: number;
  currentDepth?: number;
  isAdmin?: boolean;
  adminUser?: { username?: string; role?: string } | null;
}

export function ThreadedMessageCompact({
  message,
  onReply,
  onUpdate,
  maxDepth = 5,
  currentDepth = 0,
  isAdmin = false,
  adminUser = null,
}: ThreadedMessageProps) {
  const { toast } = useToast();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyAuthor, setReplyAuthor] = useState(
    isAdmin && adminUser?.username ? adminUser.username : ""
  );
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getAuthorColor = (authorType: AuthorType) => {
    return authorType === "admin"
      ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
      : "bg-green-500/20 text-green-600 dark:text-green-400";
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a reply message",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiService.replyToMessage(
        message.id,
        replyContent.trim(),
        replyAuthor.trim() || "Anonymous"
      );

      if (response.success) {
        toast({
          title: "Success",
          description: "Reply posted successfully!",
        });
        setReplyContent("");
        setReplyAuthor("");
        setIsReplying(false);
        onUpdate?.();
      } else {
        throw new Error(response.error || "Failed to post reply");
      }
    } catch (error) {
      console.error("Error posting reply:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to post reply",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const hasReplies = message.replies && message.replies.length > 0;
  const canReply = currentDepth < maxDepth && isAdmin;

  return (
    <div className="space-y-2">
      {/* Main Message */}
      <div className="group">
        <div className="flex gap-3 p-3 hover:bg-white/5 dark:hover:bg-black/5 transition-all duration-200 rounded-lg">
          {/* Thread Indicator */}
          {currentDepth > 0 && (
            <div className="flex items-start pt-2">
              <CornerDownRight className="h-4 w-4 text-muted-foreground/50" />
            </div>
          )}

          {/* Avatar */}
          <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
            <AvatarFallback className={getAuthorColor(message.authorType)}>
              {message.author?.charAt(0).toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-medium text-foreground text-sm">
                {message.author || "Anonymous"}
              </span>
              {message.authorType === "admin" && (
                <Badge variant="secondary" className="h-5 text-xs">
                  Admin
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {formatDate(message.dateCreated)}
              </span>
              {message.level === 0 && (
                <Badge variant="outline" className="h-5 text-xs">
                  Question
                </Badge>
              )}
            </div>

            {/* Message Content */}
            <div className="text-sm text-foreground leading-relaxed mb-2 whitespace-pre-wrap">
              {message.content}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 text-xs">
              {hasReplies && (
                <button
                  onClick={handleToggleExpand}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                  {message.replies?.length || 0}{" "}
                  {(message.replies?.length || 0) === 1 ? "reply" : "replies"}
                </button>
              )}

              {canReply && (
                <button
                  onClick={() => setIsReplying(!isReplying)}
                  className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors"
                >
                  <Reply className="h-3 w-3" />
                  Reply
                </button>
              )}

              {!hasReplies && !isAdmin && currentDepth === 0 && (
                <span className="text-muted-foreground text-xs">
                  Only administrators can reply
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Reply Form */}
        {isReplying && (
          <div className="ml-14 mt-2 p-3 bg-blue-50/30 dark:bg-blue-900/10 rounded-lg border-l-2 border-blue-500/50">
            <div className="space-y-2">
              <input
                type="text"
                placeholder={
                  isAdmin ? "Admin name (auto-filled)" : "Your name (optional)"
                }
                value={replyAuthor}
                onChange={(e) => setReplyAuthor(e.target.value)}
                className="w-full px-2 py-1 text-sm bg-white/20 dark:bg-black/20 border border-blue-500/20 rounded text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500/50"
                readOnly={isAdmin && adminUser?.username ? true : false}
              />
              <Textarea
                placeholder="Write your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[60px] text-sm resize-none bg-white/20 dark:bg-black/20 border border-blue-500/20 focus:border-blue-500/50"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmitReply}
                  disabled={isSubmitting || !replyContent.trim()}
                  size="sm"
                  className="h-7 px-3 text-xs"
                >
                  <Send className="h-3 w-3 mr-1" />
                  {isSubmitting ? "Posting..." : "Reply"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsReplying(false);
                    setReplyContent("");
                    setReplyAuthor("");
                  }}
                  className="h-7 px-3 text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {hasReplies && isExpanded && (
        <div className="space-y-2">
          {message.replies?.map((reply) => (
            <ThreadedMessageCompact
              key={reply.id}
              message={reply}
              onReply={onReply}
              onUpdate={onUpdate}
              maxDepth={maxDepth}
              currentDepth={currentDepth + 1}
              isAdmin={isAdmin}
              adminUser={adminUser}
            />
          ))}
        </div>
      )}
    </div>
  );
}
