import React, { useEffect, useState, useCallback, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { TextAlign } from "@tiptap/extension-text-align";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Image } from "@tiptap/extension-image";
import ResizeImage from "tiptap-extension-resize-image";
import { Link } from "@tiptap/extension-link";
import { Placeholder } from "@tiptap/extension-placeholder";
import { CharacterCount } from "@tiptap/extension-character-count";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Type, Maximize2, Minimize2,
  Table as TableIcon, Image as ImageIcon, Link as LinkIcon,
  ChevronDown, Save, Undo2, Redo2, Pencil,
  RotateCcw, Trash2, Printer, Share2,
  Eye, Layout as LayoutIcon, Home, Plus,
  Hash, Scissors, Copy, Clipboard,
  Type as FontIcon, ZoomIn, ZoomOut, Check,
  Cloud, CloudOff, Loader2, Sparkles, Sidebar,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";

// Custom Extensions
import { Extension } from "@tiptap/core";

const FontSize = Extension.create({
  name: "fontSize",
  addOptions() { return { types: ["textStyle"] }; },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize: (fontSize) => ({ chain }) => chain().setMark("textStyle", { fontSize }).run(),
    };
  },
});

const LineHeight = Extension.create({
  name: "lineHeight",
  addOptions() { return { types: ["paragraph", "heading"], defaultLineHeight: "1.5" }; },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: this.options.defaultLineHeight,
            parseHTML: (element) => element.style.lineHeight,
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) return {};
              return { style: `line-height: ${attributes.lineHeight}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setLineHeight: (lineHeight) => ({ commands }) => {
        return this.options.types.every((type) => commands.updateAttributes(type, { lineHeight }));
      },
    };
  },
});

const PageBreak = Extension.create({
  name: "pageBreak",
  group: "block",
  content: "inline*",
  parseHTML() { return [{ tag: 'div[data-type="page-break"]' }]; },
  renderHTML() { return ["div", { "data-type": "page-break", class: "page-break-indicator" }]; },
  addCommands() {
    return {
      setPageBreak: () => ({ chain }) => chain().insertContent({ type: this.name }).run(),
    };
  },
});

const socket = io(import.meta.env.VITE_BACKEND || "http://localhost:5000");

const FONTS = [
  // --- Sans-Serif (Modern) ---
  { name: "Plus Jakarta Sans", value: "Plus Jakarta Sans" },
  { name: "Inter", value: "Inter" },
  { name: "Montserrat", value: "Montserrat" },
  { name: "Poppins", value: "Poppins" },
  { name: "Roboto", value: "Roboto" },
  { name: "Open Sans", value: "Open Sans" },
  { name: "Lato", value: "Lato" },
  { name: "Nunito", value: "Nunito" },
  { name: "Raleway", value: "Raleway" },
  { name: "Work Sans", value: "Work Sans" },
  { name: "Fira Sans", value: "Fira Sans" },
  { name: "Quicksand", value: "Quicksand" },
  { name: "DM Sans", value: "DM Sans" },
  { name: "Outfit", value: "Outfit" },
  { name: "Sora", value: "Sora" },
  { name: "Lexend", value: "Lexend" },
  { name: "Manrope", value: "Manrope" },
  { name: "Jost", value: "Jost" },
  { name: "Cabin", value: "Cabin" },
  { name: "Mulish", value: "Mulish" },
  { name: "Karla", value: "Karla" },
  { name: "Barlow", value: "Barlow" },
  { name: "Exo 2", value: "Exo 2" },
  // --- Sans-Serif (Classic) ---
  { name: "Ubuntu", value: "Ubuntu" },
  { name: "PT Sans", value: "PT Sans" },
  { name: "Oswald", value: "Oswald" },
  { name: "Source Sans 3", value: "Source Sans 3" },
  { name: "Hind", value: "Hind" },
  { name: "Muli", value: "Muli" },
  // --- Serif ---
  { name: "Playfair Display", value: "Playfair Display" },
  { name: "Merriweather", value: "Merriweather" },
  { name: "Lora", value: "Lora" },
  { name: "EB Garamond", value: "EB Garamond" },
  { name: "Libre Baskerville", value: "Libre Baskerville" },
  { name: "Crimson Text", value: "Crimson Text" },
  { name: "PT Serif", value: "PT Serif" },
  { name: "Cormorant Garamond", value: "Cormorant Garamond" },
  { name: "Libre Caslon Text", value: "Libre Caslon Text" },
  // --- Display / Stylish ---
  { name: "Bebas Neue", value: "Bebas Neue" },
  { name: "Anton", value: "Anton" },
  { name: "Righteous", value: "Righteous" },
  { name: "Comfortaa", value: "Comfortaa" },
  { name: "Pacifico", value: "Pacifico" },
  // --- Monospace ---
  { name: "Fira Code", value: "Fira Code" },
  { name: "JetBrains Mono", value: "JetBrains Mono" },
  { name: "Source Code Pro", value: "Source Code Pro" },
  { name: "Space Mono", value: "Space Mono" },
  { name: "Courier Prime", value: "Courier Prime" },
  // --- Handwriting ---
  { name: "Dancing Script", value: "Dancing Script" },
  { name: "Caveat", value: "Caveat" },
  { name: "Satisfy", value: "Satisfy" },
  { name: "Patrick Hand", value: "Patrick Hand" },
  // --- System Fonts ---
  { name: "Arial", value: "Arial" },
  { name: "Times New Roman", value: "Times New Roman" },
  { name: "Courier New", value: "Courier New" },
  { name: "Georgia", value: "Georgia" },
  { name: "Trebuchet MS", value: "Trebuchet MS" },
  { name: "Verdana", value: "Verdana" },
];

const FONT_SIZES = ["8", "9", "10", "11", "12", "14", "16", "18", "20", "24", "30", "36", "48", "60", "72"];

// --- CUSTOM COMPONENTS ---

const Tooltip = ({ children, text }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex items-center" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] font-semibold rounded shadow-xl whitespace-nowrap z-[100] pointer-events-none border border-white/10"
          >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ImageLibraryModal = ({ isOpen, onClose, onSelect }) => {
  const sampleImages = [
    { url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80", label: "Workspace" },
    { url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80", label: "Writing" },
    { url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80", label: "Pen & Paper" },
    { url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80", label: "Collaboration" },
    { url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80", label: "Minimalist" },
    { url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80", label: "Tech Team" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">Image Library</h3>
                <p className="text-gray-500 text-sm font-medium">Select a professional image for your document.</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
              >
                <Maximize2 className="rotate-45" size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {sampleImages.map((img, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -5, scale: 1.02 }}
                    onClick={() => { onSelect(img.url); onClose(); }}
                    className="group cursor-pointer rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
                  >
                    <div className="aspect-video relative">
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors" />
                    </div>
                    <div className="p-3 bg-white">
                      <p className="text-xs font-semibold text-gray-700">{img.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-gray-50 border-t border-gray-100 text-center">
              <button
                onClick={() => {
                  const url = prompt("Or paste an image URL here:");
                  if (url) { onSelect(url); onClose(); }
                }}
                className="text-blue-600 text-sm font-semibold hover:underline"
              >
                Paste custom image URL instead
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function Editor() {
  const { id: docId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Home");
  const [zoom, setZoom] = useState(100);
  const [showRuler, setShowRuler] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState("Synced");
  const [collaborators, setCollaborators] = useState([]);
  const [title, setTitle] = useState("Untitled Document");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const titleInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Prevent duplicate extension warnings by disabling if they cause issues
        // or ensuring they are correctly configured
      }),
      Underline,
      TextStyle,
      FontFamily,
      FontSize,
      LineHeight,
      PageBreak,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "draggable-image"
        }
      }),
      ResizeImage,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Start writing your masterpiece..." }),
      CharacterCount,
    ],
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none min-h-[1123px] w-full mx-auto px-[96px] py-[110px] bg-white rounded-sm shadow-[0_20px_60px_rgba(15,23,42,0.08)] border border-slate-200 transition-all duration-300 font-medium text-slate-800",
        style: `width: 794px; min-height: 1123px;`,
      },
    },
    onUpdate: ({ editor, transaction }) => {
      if (transaction.getMeta("socket")) return;
      const json = editor.getJSON();
      socket.emit("send-changes", json);
      setIsSyncing(true);
      setSyncStatus("Syncing...");
    },
  });

  // Socket Logic
  useEffect(() => {
    if (!editor || !docId) return;

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    socket.emit("join-document", { docId, user: storedUser });

    socket.on("load-document", (doc) => {
      if (doc?.content) {
        editor.commands.setContent(doc.content);
      }
      if (doc?.title) {
        setTitle(doc.title);
      }
    });

    socket.on("receive-changes", (content) => {
      editor.commands.setContent(content, false, { socket: true });
    });

    socket.on("receive-title", (newTitle) => {
      setTitle(newTitle);
    });

    socket.on("update-presence", (users) => {
      setCollaborators(users);
    });

    return () => {
      socket.off("load-document");
      socket.off("receive-changes");
      socket.off("receive-title");
      socket.off("update-presence");
    };
  }, [editor, docId]);

  // Auto-save
  useEffect(() => {
    const timer = setInterval(() => {
      if (isSyncing && editor) {
        handleSave();
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [isSyncing, editor, title]);

  const handleSave = () => {
    if (!editor) return;
    const content = editor.getJSON();
    socket.emit("save-document", { docId, content, title });
    setIsSyncing(false);
    setSyncStatus("Saved");
    setTimeout(() => setSyncStatus("Synced"), 2000);
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    socket.emit("send-title", newTitle);
    setIsSyncing(true);
  };

  const toggleTitleEdit = () => {
    setIsEditingTitle(!isEditingTitle);
    if (!isEditingTitle) {
      setTimeout(() => titleInputRef.current?.focus(), 100);
    }
  };

  const handlePrint = () => window.print();

  if (!editor) return null;

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col font-sans selection:bg-blue-50 h-screen overflow-hidden">

      {/* --- REFINED GLASS RIBBON --- */}
      <header className="bg-white border-b border-slate-200 z-50 flex-none px-8 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
        {/* Top bar: Title & Actions */}
        <div className="h-14 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 hover:bg-gray-50 rounded-xl transition-all group border border-transparent hover:border-gray-100"
            >
              <Sidebar className="text-gray-400 group-hover:text-blue-500 transition-colors" size={20} />
            </button>

            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 mb-0.5">
                <FileText size={20} />
              </div>
              {isEditingTitle ? (
                <input
                  ref={titleInputRef}
                  value={title}
                  onChange={handleTitleChange}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
                  className="bg-gray-50 px-3 py-1.5 rounded-lg outline-none border border-blue-200 font-medium text-gray-800 text-sm w-72 transition-all shadow-inner"
                />
              ) : (
                <h1
                  onClick={toggleTitleEdit}
                  className="font-medium text-slate-800 text-sm cursor-pointer tracking-tight hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-all flex items-center gap-3 border border-transparent hover:border-gray-100"
                >
                  {title}
                  <Pencil size={14} className="opacity-0 group-hover:opacity-30 transition-opacity" />
                </h1>
              )}
            </div>

            <div className="h-5 w-[1px] bg-gray-100 mx-2" />

            <div className="flex items-center gap-2.5">
              {syncStatus === "Syncing..." ? (
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-500 animate-pulse">
                  <Loader2 size={12} className="animate-spin" />
                  Syncing
                </span>
              ) : (
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                  <Cloud size={14} />
                  {syncStatus}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex -space-x-2.5 mr-3">
              {collaborators.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  title={c.name}
                  className={`w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-white flex items-center justify-center text-white text-[11px] font-bold shadow-sm transition-all hover:scale-110 cursor-help ring-2 ring-transparent hover:ring-blue-100`}
                >
                  {c.name?.[0].toUpperCase() || "?"}
                </motion.div>
              ))}
              {collaborators.length > 5 && (
                <div className="w-9 h-9 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center text-gray-400 text-[10px] font-bold border-dashed">
                  +{collaborators.length - 5}
                </div>
              )}
            </div>

            <button className="flex items-center gap-2.5 px-4 y-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-100 transition-all active:scale-95 py-2">
              <Share2 size={16} />
              Share
            </button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="p-2.5 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-gray-600 transition-all border border-transparent hover:border-gray-100"
            >
              <Save size={20} />
            </motion.button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2">
          {["Home", "Insert", "Layout", "View"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 text-xs font-semibold tracking-wide transition-all relative ${activeTab === tab ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
                }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="ribbonTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          ))}
        </div>

        {/* Dynamic Ribbon Content */}
        <div className="h-24 flex items-center gap-8 py-3">
          {activeTab === "Home" && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-6 px-2">
              {/* Font Selection */}
              <div className="flex flex-col gap-2 pr-6 border-r border-gray-100">
                <div className="flex items-center gap-3">
                  <select
                    onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
                    className="h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs font-medium w-40 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 appearance-none cursor-pointer"
                  >
                    {FONTS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                  </select>
                  <select
                    onChange={(e) => editor.chain().focus().setFontSize(e.target.value + 'pt').run()}
                    className="h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs font-medium w-20 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 appearance-none cursor-pointer"
                  >
                    {FONT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex gap-1.5 h-8">
                  <Tooltip text="Bold (Ctrl+B)"><RibbonButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} icon={<Bold size={16} />} /></Tooltip>
                  <Tooltip text="Italic (Ctrl+I)"><RibbonButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} icon={<Italic size={16} />} /></Tooltip>
                  <Tooltip text="Underline (Ctrl+U)"><RibbonButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} icon={<UnderlineIcon size={16} />} /></Tooltip>
                  <Tooltip text="Strikethrough"><RibbonButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} icon={<Strikethrough size={16} />} /></Tooltip>
                  <div className="w-[1px] bg-gray-100 h-4 self-center mx-1" />
                  <Tooltip text="Bullet List"><RibbonButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} icon={<List size={18} />} /></Tooltip>
                  <Tooltip text="Ordered List"><RibbonButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} icon={<ListOrdered size={18} />} /></Tooltip>
                </div>
              </div>

              {/* Alignment */}
              <div className="flex flex-col gap-2 pr-6 border-r border-gray-100">
                <div className="flex gap-1.5">
                  <Tooltip text="Align Left"><RibbonButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} icon={<AlignLeft size={16} />} /></Tooltip>
                  <Tooltip text="Align Center"><RibbonButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} icon={<AlignCenter size={16} />} /></Tooltip>
                  <Tooltip text="Align Right"><RibbonButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} icon={<AlignRight size={16} />} /></Tooltip>
                  <Tooltip text="Justify"><RibbonButton onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} icon={<AlignJustify size={16} />} /></Tooltip>
                </div>
                <div className="flex gap-1.5 h-8">
                  <select
                    onChange={(e) => editor.chain().focus().setLineHeight(e.target.value).run()}
                    className="h-7 bg-transparent text-[11px] font-semibold text-gray-500 outline-none w-24 cursor-pointer hover:text-blue-500 transition-colors"
                  >
                    <option value="1.0">1.0 spacing</option>
                    <option value="1.15">1.2 spacing</option>
                    <option value="1.5">1.5 spacing</option>
                    <option value="2.0">2.0 spacing</option>
                  </select>
                </div>
              </div>

              {/* History */}
              <div className="flex items-center gap-2">
                <Tooltip text="Undo (Ctrl+Z)"><RibbonButton onClick={() => editor.chain().focus().undo().run()} icon={<Undo2 size={18} />} /></Tooltip>
                <Tooltip text="Redo (Ctrl+Y)"><RibbonButton onClick={() => editor.chain().focus().redo().run()} icon={<Redo2 size={18} />} /></Tooltip>
                <Tooltip text="Clear Formatting">
                  <button onClick={() => editor.chain().focus().unsetAllMarks().run()} className="p-2 hover:bg-red-50 rounded-lg text-gray-300 hover:text-red-500 transition-all border border-transparent hover:border-red-100">
                    <RotateCcw size={18} />
                  </button>
                </Tooltip>
              </div>
            </motion.div>
          )}

          {activeTab === "Insert" && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-10 px-6">

              {/* Insert New Table */}
              <div className="flex flex-col items-center gap-2">
                <Tooltip text="Insert 3x3 Table">
                  <RibbonAction
                    onClick={() =>
                      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
                    }
                    icon={<TableIcon size={20} />}
                    label="New Table"
                  />
                </Tooltip>
              </div>

              {/* Table Controls */}
              {editor.isActive("table") && (
                <div className="flex items-center gap-4 border-l border-gray-200 pl-8">

                  <RibbonAction
                    onClick={() => editor.chain().focus().addRowAfter().run()}
                    icon={<Plus size={18} />}
                    label="Row +"
                  />

                  <RibbonAction
                    onClick={() => editor.chain().focus().deleteRow().run()}
                    icon={<Trash2 size={18} />}
                    label="Row -"
                  />

                  <RibbonAction
                    onClick={() => editor.chain().focus().addColumnAfter().run()}
                    icon={<Plus size={18} />}
                    label="Col +"
                  />

                  <RibbonAction
                    onClick={() => editor.chain().focus().deleteColumn().run()}
                    icon={<Trash2 size={18} />}
                    label="Col -"
                  />

                  <RibbonAction
                    onClick={() => editor.chain().focus().mergeCells().run()}
                    icon={<LayoutIcon size={18} />}
                    label="Merge"
                  />

                  <RibbonAction
                    onClick={() => editor.chain().focus().splitCell().run()}
                    icon={<Scissors size={18} />}
                    label="Split"
                  />

                  <RibbonAction
                    onClick={() => editor.chain().focus().deleteTable().run()}
                    icon={<Trash2 size={18} />}
                    label="Delete"
                  />

                </div>
              )}

              {/* Image */}
              <Tooltip text="Open Image Library">
                <RibbonAction
                  onClick={() => setIsImageModalOpen(true)}
                  icon={<ImageIcon size={20} />}
                  label="Image"
                />
              </Tooltip>

            </motion.div>
          )}
          <Tooltip text="Add Hyperlink">
            <RibbonAction
              onClick={() => {
                const url = prompt("Enter link URL");
                if (url) editor.chain().focus().setLink({ href: url }).run();
              }}
              icon={<LinkIcon size={20} />}
              label="Link"
            />
          </Tooltip>
          <Tooltip text="Force New Page">
            <RibbonAction
              onClick={() => editor.chain().focus().setPageBreak().run()}
              icon={<Maximize2 size={20} />}
              label="Page Break"
            />
          </Tooltip>

      {activeTab === "Layout" && (
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-8 px-8">
          <div className="flex flex-col gap-1.5 items-center px-6 border-r border-gray-100">
            <LayoutIcon size={20} className="text-gray-400" />
            <span className="text-[10px] font-bold uppercase text-gray-400 tracking-tighter">A4 Vertical</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="flex flex-col items-center gap-2 group">
              <div className="w-11 h-11 border border-gray-100 rounded-xl bg-gray-50 flex items-center justify-center group-hover:border-blue-200 group-hover:bg-white transition-all group-hover:shadow-sm">
                <Sidebar size={20} className="text-gray-400 group-hover:text-blue-500" />
              </div>
              <span className="text-[10px] font-semibold text-gray-400 group-hover:text-gray-600 tracking-tighter uppercase transition-colors">Margins</span>
            </button>
          </div>
        </motion.div>
      )}

      {activeTab === "View" && (
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-8 px-6">
          <div className="flex items-center gap-4 bg-gray-50/50 p-2.5 rounded-2xl border border-gray-100/50 h-12">
            <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-1.5 hover:bg-white rounded-lg transition-all text-gray-400 hover:text-gray-600 hover:shadow-sm">
              <Minimize2 size={16} />
            </button>
            <span className="text-xs font-bold min-w-[45px] text-center text-gray-600">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-1.5 hover:bg-white rounded-lg transition-all text-gray-400 hover:text-gray-600 hover:shadow-sm">
              <Maximize2 size={16} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={showRuler} onChange={() => setShowRuler(!showRuler)} className="sr-only" />
              <div className={`w-9 h-5 rounded-full relative transition-all duration-300 ${showRuler ? 'bg-blue-600 shadow-lg shadow-blue-100' : 'bg-gray-200'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${showRuler ? 'translate-x-5' : 'translate-x-1'}`} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-400 group-hover:text-gray-600 transition-colors">Document Ruler</span>
            </label>
          </div>

          <div className="w-[1px] bg-gray-100 h-8" />
          <RibbonAction icon={<Printer size={20} />} label="Print" onClick={handlePrint} />
        </motion.div>
      )}
    </div>
    </header >

    {/* --- WORKSPACE --- */ }
    <div div className = "flex-1 overflow-auto bg-gradient-to-br from-slate-100 via-slate-100 to-slate-200/60 p-16 custom-scrollbar relative" >
      <div
        className="mx-auto transition-transform duration-500 origin-top flex flex-col items-center"
        style={{ transform: `scale(${zoom / 100})` }}
      >
        {/* Ruler */}
        {showRuler && (
          <div className="w-[794px] h-7 bg-white border-x border-t border-gray-200 sticky top-0 z-10 flex px-[96px] shadow-sm rounded-t-sm">
            <div className="absolute inset-0 flex items-end justify-between px-[96px] pb-1.5">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className={`w-[1px] bg-gray-200 ${i % 5 === 0 ? 'h-2' : 'h-1'}`} />
                  <span className="text-[8px] text-gray-300 font-medium mt-1 select-none">{i}</span>
                </div>
              ))}
            </div>
            <div className="flex-1 bg-blue-50/20 h-full border-x border-blue-50/50" />
          </div>
        )}

        {/* Page Container */}
        <div className="relative group">
          {/* Page decoration */}
          <div className="absolute -left-16 top-0 bottom-0 w-10 flex flex-col items-center gap-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-[1px] h-40 bg-gradient-to-b from-blue-500/20 to-transparent rounded-full" />
            <button disabled className="p-2.5 bg-white rounded-xl shadow-xl border border-gray-100 text-blue-500 hover:scale-110 transition-transform cursor-not-allowed opacity-50">
              <Plus size={18} />
            </button>
          </div>

          <EditorContent editor={editor} />
        </div>

        {/* Simulated Pagination */}
        {editor.storage.characterCount.characters() > 3000 && (
          <div className="mt-10 relative animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-40 h-1 bg-gray-200 rounded-full" />
            <div className="w-[794px] h-[1123px] bg-white shadow-xl border border-gray-100 flex items-center justify-center rounded-sm">
              <p className="text-gray-200 italic font-medium tracking-wide">Flowing content...</p>
            </div>
          </div>
        )}
      </div>
      </div>

    {/* --- REFINED STATUS BAR --- */ }
    <div footer className = "h-10 bg-white border-t border-gray-100 flex items-center justify-between px-8 z-50 shadow-sm" >
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2.5 text-[11px] font-semibold text-gray-400 tracking-wide">
            <Hash size={13} className="text-blue-400" />
            <span>{editor.storage.characterCount.characters()} Characters</span>
          </div>
          <div className="flex items-center gap-2.5 text-[11px] font-semibold text-gray-400 tracking-wide">
            <Plus size={13} className="text-indigo-400" />
            <span>{editor.storage.characterCount.words()} Words</span>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-gray-300 tracking-wider uppercase transition-colors hover:text-blue-500 cursor-default px-2 py-0.5 rounded">Draft</span>
            <div className="h-4 w-[1px] bg-gray-100" />
            <span className="text-[10px] font-bold text-blue-600 tracking-wider uppercase bg-blue-50 px-3 py-0.5 rounded-full">Editing Mode</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="text-gray-300 hover:text-blue-500 transition-colors"><ZoomOut size={16} /></button>
              <div className="w-28 h-1 bg-gray-50 rounded-full relative group cursor-pointer border border-gray-100 overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/80 rounded-full" style={{ width: `${(zoom - 50) / 150 * 100}%` }} />
              </div>
              <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="text-gray-300 hover:text-blue-500 transition-colors"><ZoomIn size={16} /></button>
            </div>
            <span className="text-[11px] font-bold text-gray-500 min-w-[35px] text-right">{zoom}%</span>
          </div>
        </div>
      </div>

    {/* Modals */ }
    < ImageLibraryModal
  isOpen = { isImageModalOpen }
  onClose = {() => setIsImageModalOpen(false)
}
onSelect = {(url) => editor.chain().focus().setImage({ src: url }).run()}
      />

  < style dangerouslySetInnerHTML = {{
  __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=Montserrat:wght@400;600;700&family=Poppins:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Roboto:wght@300;400;500;700&family=Open+Sans:wght@400;600&family=Lato:wght@300;400;700&family=Oswald:wght@400;500;600&family=Raleway:wght@400;600;700&family=Ubuntu:wght@400;500;700&family=Merriweather:ital,wght@0,400;0,700;1,400&family=PT+Sans:wght@400;700&family=Nunito:wght@400;600;700&family=Work+Sans:wght@400;500;600&family=Fira+Sans:wght@400;500;600&family=Quicksand:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&family=Sora:wght@300;400;600;700&family=Lexend:wght@300;400;500;600&family=Manrope:wght@400;500;600;700&family=Jost:wght@300;400;500;600&family=Cabin:wght@400;500;600;700&family=Mulish:wght@400;600;700&family=Karla:wght@400;500;600;700&family=Barlow:wght@300;400;500;600&family=Exo+2:wght@300;400;500;600&family=Source+Sans+3:wght@300;400;600&family=Hind:wght@300;400;500;600&family=Lora:ital,wght@0,400;0,600;1,400&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=PT+Serif:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Bebas+Neue&family=Anton&family=Righteous&family=Comfortaa:wght@400;600;700&family=Pacifico&family=Fira+Code:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&family=Source+Code+Pro:wght@400;500;600&family=Space+Mono:wght@400;700&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Dancing+Script:wght@400;600;700&family=Caveat:wght@400;600;700&family=Satisfy&family=Patrick+Hand&display=swap');
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .page-break-indicator {
          height: 1px;
          background: #f3f4f6;
          margin: 60px -96px;
          position: relative;
        }
        .page-break-indicator::after {
          content: 'NEW PAGE';
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          background: #f9fafb;
          padding: 0 16px;
          font-size: 8px;
          font-weight: 800;
          color: #d1d5db;
          letter-spacing: 0.3em;
        }
        
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #d1d5db;
          pointer-events: none;
          height: 0;
          font-style: italic;
        }

        .draggable-image {
          cursor: move;
          display: block;
          max-width: 100%;
          margin: 20px auto;
          position: relative;
        }

.ProseMirror-selectednode {
  outline: 2px solid #3b82f6;
}

        .ProseMirror {
  font-size: 16px;
  line-height: 1.8;
  letter-spacing: -0.01em;
  color: #1e293b;
}

.ProseMirror h1 {
  font-size: 32px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.ProseMirror h2 {
  font-size: 24px;
  font-weight: 600;
}

.ProseMirror p {
  font-weight: 500;
}

.ProseMirror img {
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(15,23,42,0.1);
}

        .custom-scrollbar::-webkit-scrollbar { width: 10px; height: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; border: 3px solid #f3f4f6; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }

        body { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}} />
    </div >
  );
}

const RibbonButton = ({ icon, onClick, active, title }) => (
  <button
    title={title}
    onClick={onClick}
    className={`p-2 rounded-xl transition-all duration-200 border ${active
      ? "bg-blue-50 text-blue-600 border-blue-200 shadow-sm"
      : "hover:bg-slate-50 text-slate-400 hover:text-slate-700 border-transparent hover:border-slate-200"
      }`}
  >
    {icon}
  </button>
);

const RibbonAction = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-2 group min-w-[56px]"
  >
    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 border border-transparent transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-50">
      {icon}
    </div>
    <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-800 uppercase tracking-tight transition-colors">{label}</span>
  </button>
);
