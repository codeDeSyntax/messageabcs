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
} from "lucide-react";
import { ThreadedMessage, AuthorType } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import { GAME_BUTTON_SMALL } from "@/constants/gameStyles";

interface ThreadedMessageProps {
  message: ThreadedMessage;
  onReply?: (parentId: string, content: string, author: string) => void;
  onUpdate?: () => void;
  maxDepth?: number;
  currentDepth?: number;
}

export function ThreadedMessageComponent({
  message,
  onReply,
  onUpdate,
  maxDepth = 5,
  currentDepth = 0,
}: ThreadedMessageProps) {
  const { toast } = useToast();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyAuthor, setReplyAuthor] = useState("");
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

  const marginLeft = Math.min(currentDepth * 24, maxDepth * 24);
  const hasReplies = message.replies && message.replies.length > 0;
  const canReply = currentDepth < maxDepth;

  return (
    <div className="space-y-3">
      {/* Main Message */}
      <div
        className="group hover:bg-white/5 dark:hover:bg-black/5 transition-all duration-200 cursor-pointer md:p-6 rounded-lg"
        style={{ marginLeft: `${marginLeft}px` }}
      >
        {/* Message Section */}
        <div className="mb-4">
          <div className="flex items-start gap-4">
            {/* User Avatar */}
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback className={getAuthorColor(message.authorType)}>
                {message.author?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-semibold text-foreground">
                  {message.author || "Anonymous"}
                </span>
                <span className="text-sm text-muted-foreground">
                  {message.level === 0 ? "asked" : "replied"}{" "}
                  {formatDate(message.dateCreated)}
                </span>
                {message.authorType === "admin" && (
                  <button
                    className={`${GAME_BUTTON_SMALL.primary} text-xs px-2 py-1 ml-2`}
                  >
                    Admin
                  </button>
                )}
                {message.level === 0 && (
                  <button
                    className={`${GAME_BUTTON_SMALL.success} text-xs px-2 py-1 ml-2`}
                  >
                    Question
                  </button>
                )}
              </div>

              <div
                className={`text-lg font-semibold text-foreground mb-2 font-reading leading-relaxed ${
                  message.level === 0
                    ? "underline decoration-blue-500/50 decoration-2 underline-offset-4"
                    : ""
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>

            {hasReplies && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleExpand}
                className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors flex-shrink-0 h-8 w-8 p-0"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Replies Section */}
        {hasReplies ? (
          <div className="ml-12">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="h-4 w-4 text-green-500" />
              <button
                className={`${GAME_BUTTON_SMALL.success} text-xs px-3 py-1`}
                onClick={handleToggleExpand}
              >
                {message.replies?.length || 0} Reply
                {(message.replies?.length || 0) !== 1 ? "s" : ""}
              </button>
              {canReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsReplying(!isReplying)}
                  className="text-blue-500 hover:text-blue-600 h-7 px-2"
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Reply
                </Button>
              )}
            </div>
          </div>
        ) : (
          canReply && (
            <div className="ml-12">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-orange-500" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsReplying(!isReplying)}
                  className="text-blue-500 hover:text-blue-600 h-7 px-2"
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Be the first to reply!
                </Button>
              </div>
            </div>
          )
        )}

        {/* Reply Form */}
        {isReplying && (
          <div className="ml-12 mt-4 p-4 bg-blue-50/30 dark:bg-blue-900/10 rounded-lg border-l-4 border-blue-500/50">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Your name (optional)"
                value={replyAuthor}
                onChange={(e) => setReplyAuthor(e.target.value)}
                className="w-full px-3 py-2 bg-white/20 dark:bg-black/20 border border-blue-500/20 rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500/50"
              />
              <Textarea
                placeholder="Write your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[80px] resize-none bg-white/20 dark:bg-black/20 border border-blue-500/20 focus:border-blue-500/50"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmitReply}
                  disabled={isSubmitting || !replyContent.trim()}
                  className={`${GAME_BUTTON_SMALL.primary} px-4`}
                >
                  <Send className="h-3 w-3 mr-1" />
                  {isSubmitting ? "Posting..." : "Post Reply"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsReplying(false);
                    setReplyContent("");
                    setReplyAuthor("");
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Separator line between messages */}
        <div className="mt-4 border-b border-gray-200/10 dark:border-gray-700/10"></div>
      </div>

      {/* Nested Replies */}
      {hasReplies && isExpanded && (
        <div className="space-y-4">
          {message.replies?.map((reply) => (
            <div key={reply.id} className="ml-12">
              <div className="bg-green-50/30 dark:bg-green-900/10 rounded-lg p-3 border-l-4 border-green-500/50">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback
                      className={getAuthorColor(reply.authorType)}
                    >
                      {reply.author?.charAt(0).toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-medium text-green-700 dark:text-green-300 text-sm">
                      {reply.author || "Anonymous"}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      replied {formatDate(reply.dateCreated)}
                    </span>
                    {reply.authorType === "admin" && (
                      <Badge variant="default" className="ml-2 text-xs">
                        Admin
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-foreground font-reading leading-relaxed whitespace-pre-wrap">
                  {reply.content}
                </p>
              </div>

              {/* Nested replies for the reply */}
              {reply.replies &&
                reply.replies.length > 0 &&
                currentDepth + 1 < maxDepth && (
                  <div className="mt-3 space-y-3">
                    {reply.replies.map((nestedReply) => (
                      <ThreadedMessageComponent
                        key={nestedReply.id}
                        message={nestedReply}
                        onReply={onReply}
                        onUpdate={onUpdate}
                        maxDepth={maxDepth}
                        currentDepth={currentDepth + 2}
                      />
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
