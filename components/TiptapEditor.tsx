import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Document } from "@tiptap/extension-document";
import { Paragraph } from "@tiptap/extension-paragraph";
import { HardBreak } from "@tiptap/extension-hard-break";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { Blockquote } from "@tiptap/extension-blockquote";
import { Heading } from "@tiptap/extension-heading";
import { Link } from "@tiptap/extension-link";
import { BulletList } from "@tiptap/extension-bullet-list";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { ListItem } from "@tiptap/extension-list-item";
import { Extension } from "@tiptap/core";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Palette,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Settings,
  ChevronDown,
  Highlighter,
  Quote,
  Link as LinkIcon,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

// Custom FontSize extension
const FontSize = Extension.create({
  name: "fontSize",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) =>
              element.style.fontSize.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }

              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function TiptapEditor({
  content,
  onChange,
  placeholder = "Start writing...",
  className,
}: TiptapEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSizePicker, setShowFontSizePicker] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  // Helper functions for link handling
  const setLink = () => {
    if (linkUrl && editor) {
      // Ensure URL has protocol
      const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
    setShowLinkModal(false);
    setLinkUrl("");
  };

  const unsetLink = () => {
    if (editor) {
      editor.chain().focus().unsetLink().run();
    }
  };

  const openLinkModal = () => {
    if (editor) {
      const previousUrl = editor.getAttributes("link").href;
      setLinkUrl(previousUrl || "");
      setShowLinkModal(true);
    }
  };
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        // Disable default extensions to use explicit ones with better configuration
        document: false,
        paragraph: false,
        hardBreak: false,
        heading: false,
        blockquote: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      // Document structure with proper configuration
      Document,
      Paragraph.configure({
        HTMLAttributes: {
          class: "tiptap-paragraph",
          style: "margin-bottom: 1rem; line-height: 1.6;",
        },
      }),
      HardBreak.configure({
        HTMLAttributes: {
          class: "tiptap-hard-break",
        },
      }),
      // Explicit list extensions with proper configuration
      BulletList.configure({
        HTMLAttributes: {
          class: "tiptap-bullet-list",
          style: "margin: 1rem 0; padding-left: 1.5rem;",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "tiptap-ordered-list",
          style: "margin: 1rem 0; padding-left: 1.5rem;",
        },
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: "tiptap-list-item",
          style: "margin: 0.5rem 0;",
        },
      }),
      Heading.configure({
        levels: [1, 2, 3],
        HTMLAttributes: {
          class: "tiptap-heading",
          style: "margin: 1.5rem 0 1rem 0; line-height: 1.4;",
        },
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: "tiptap-blockquote",
          style:
            "margin: 1.5rem 0; padding-left: 1rem; border-left: 4px solid #cbd5e0; font-style: italic;",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      TextStyle,
      FontSize,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline hover:text-accent",
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "focus:outline-none min-h-[280px] w-full font-[serif] text-[14px] md:text-[18px] p-2 text-foreground w-full pros-invert whitespace-pre-wrap md:p-6",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <>
      {/* Global styles for proper content spacing */}

      <div
        className={`border border-none rounded-lg w-full max-w-full tiptp-editor ${className}`}
      >
        {/* Toolbar */}
        <div className="border-b p-3 flex flex-wrap gap-1 bg-muted/50 w-full">
          {/* Text Formatting */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`h-8 w-8 p-0 shadow shadow-black/20 ${
              editor.isActive("bold") ? "bg-primary/20" : ""
            }`}
          >
            <Bold className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`h-8 w-8 p-0 shadow shadow-black/20 ${
              editor.isActive("italic") ? "bg-primary/20" : ""
            }`}
          >
            <Italic className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`h-8 w-8 p-0 shadow shadow-black/20 ${
              editor.isActive("underline") ? "bg-primary/20" : ""
            }`}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>

          {/* Highlight */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`h-8 w-8 p-0 shadow shadow-black/20 ${
              editor.isActive("highlight") ? "bg-primary/20" : ""
            }`}
          >
            <Highlighter className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Link */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={openLinkModal}
            className={`h-8 w-8 p-0 shadow shadow-black/20 ${
              editor.isActive("link") ? "bg-primary/20" : ""
            }`}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>

          {editor.isActive("link") && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={unsetLink}
              className="h-8 w-8 p-0 shadow shadow-black/20"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}

          <div className="w-px h-6 bg-border mx-1" />

          {/* Blockquote */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`h-8 w-8 p-0 shadow shadow-black/20 ${
              editor.isActive("blockquote") ? "bg-primary/20" : ""
            }`}
          >
            <Quote className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Headings */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`h-8 w-8 p-0 shadow shadow-black/20 ${
              editor.isActive("heading", { level: 1 }) ? "bg-primary/20" : ""
            }`}
          >
            <Heading1 className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`h-8 w-8 p-0 shadow shadow-black/20 ${
              editor.isActive("heading", { level: 2 }) ? "bg-primary/20" : ""
            }`}
          >
            <Heading2 className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`h-8 w-8 p-0 shadow shadow-black/20 ${
              editor.isActive("heading", { level: 3 }) ? "bg-primary/20" : ""
            }`}
          >
            <Heading3 className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`h-8 w-8 p-0 shadow shadow-black/20 ${
              editor.isActive("paragraph") ? "bg-primary/20" : ""
            }`}
          >
            <Type className="h-4 w-4" />
          </Button>

          {/* Font Size Picker */}
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowFontSizePicker(!showFontSizePicker)}
              className="h-8 px-2 flex items-center gap-1"
            >
              <Settings className="h-4 w-4" />
              <ChevronDown className="h-3 w-3" />
            </Button>

            {showFontSizePicker && (
              <div className="absolute top-10 left-0 z-50 bg-background border rounded-lg p-1 shadow-lg min-w-[120px]">
                {[
                  { label: "Small", size: "12px" },
                  { label: "Normal", size: "14px" },
                  { label: "Medium", size: "16px" },
                  { label: "Large", size: "18px" },
                  { label: "X-Large", size: "20px" },
                  { label: "XX-Large", size: "24px" },
                  { label: "Huge", size: "32px" },
                ].map((fontSize) => (
                  <button
                    key={fontSize.size}
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-muted rounded text-sm"
                    style={{ fontSize: fontSize.size }}
                    onClick={() => {
                      if (fontSize.size === "14px") {
                        // Remove font size to return to normal
                        editor.chain().focus().unsetFontSize().run();
                      } else {
                        editor.chain().focus().setFontSize(fontSize.size).run();
                      }
                      setShowFontSizePicker(false);
                    }}
                  >
                    {fontSize.label}
                  </button>
                ))}
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 hover:bg-muted rounded text-sm border-t mt-1"
                  onClick={() => {
                    editor.chain().focus().unsetFontSize().run();
                    setShowFontSizePicker(false);
                  }}
                >
                  Reset Size
                </button>
              </div>
            )}
          </div>

          {/* Color Picker */}
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="h-8 w-8 p-0 shadow shadow-black/20"
            >
              <Palette className="h-4 w-4" />
            </Button>

            {showColorPicker && (
              <div className="absolute top-10 left-0 z-50 bg-background border rounded-lg p-2 shadow-lg grid grid-cols-6 gap-2">
                {/* Predefined colors */}
                {[
                  "#000000",
                  "#374151",
                  "#6B7280",
                  "#9CA3AF",
                  "#EF4444",
                  "#F97316",
                  "#EAB308",
                  "#22C55E",
                  "#3B82F6",
                  "#6366F1",
                  "#8B5CF6",
                  "#EC4899",
                  "#14B8A6",
                  "#F59E0B",
                  "#84CC16",
                  "#06B6D4",
                ].map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-6 h-6 rounded border-2 border-border hover:border-primary"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      editor.chain().focus().setColor(color).run();
                      setShowColorPicker(false);
                    }}
                  />
                ))}
                {/* Remove color option */}
                <button
                  type="button"
                  className="w-6 h-6 rounded border-2 border-border hover:border-primary bg-background relative"
                  onClick={() => {
                    editor.chain().focus().unsetColor().run();
                    setShowColorPicker(false);
                  }}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-xs text-red-500">
                    ×
                  </span>
                </button>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Lists */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`h-8 w-8 p-0 shadow shadow-black/20 ${
              editor.isActive("bulletList") ? "bg-primary/20" : ""
            }`}
          >
            <List className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`h-8 w-8 p-0 shadow shadow-black/20 ${
              editor.isActive("orderedList") ? "bg-primary/20" : ""
            }`}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Text Alignment */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`h-8 w-8 p-0 shadow shadow-black/20 ${
              editor.isActive({ textAlign: "left" }) ? "bg-primary/20" : ""
            }`}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`h-8 w-8 p-0 shadow shadow-black/20 ${
              editor.isActive({ textAlign: "center" }) ? "bg-primary/20" : ""
            }`}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`h-8 w-8 p-0 shadow shadow-black/20 ${
              editor.isActive({ textAlign: "right" }) ? "bg-primary/20" : ""
            }`}
          >
            <AlignRight className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Undo/Redo */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="h-8 w-8 p-0 shadow shadow-black/20"
          >
            <Undo className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="h-8 w-8 p-0 shadow shadow-black/20"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        {/* Editor Content */}
        <div className="min-h-[200px] max-h-[400px] overflow-y-auto no-scrollbar w-full overflow-x-hidden">
          <div className="w-full max-w-full overflow-hidden">
            <EditorContent
              editor={editor}
              className="w-full max-w-full overflow-hidden "
            />
          </div>
        </div>

        {/* Link Modal */}
        {showLinkModal && (
          <div className="fixed inset-0 bg-primary/50 flex items-center justify-center z-50">
            <div className="bg-background border rounded-lg p-4 w-96 max-w-[90vw]">
              <h3 className="text-lg font-semibold mb-3">Add Link</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">URL</label>
                  <input
                    type="text"
                    placeholder="https://example.com"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setLink();
                      } else if (e.key === "Escape") {
                        setShowLinkModal(false);
                        setLinkUrl("");
                      }
                    }}
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowLinkModal(false);
                      setLinkUrl("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={setLink}
                    disabled={!linkUrl.trim()}
                  >
                    Add Link
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
