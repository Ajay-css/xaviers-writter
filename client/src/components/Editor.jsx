import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const SAVE_INTERVAL = 2000;

export default function Editor() {
  const { id } = useParams();
  const wrapperRef = useRef(null);

  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState(null);
  const [title, setTitle] = useState("Untitled Document");
  const [wordCount, setWordCount] = useState(0);

  // 🔌 Socket
  useEffect(() => {
    const s = io(import.meta.env.VITE_BACKEND);
    setSocket(s);
    return () => s.disconnect();
  }, []);

  const Font = Quill.import("formats/font");

  Font.whitelist = [
    "arial",
    "times-new-roman",
    "courier-new",
    "georgia",
    "tahoma",
    "verdana",
    "comic-sans",
    "impact",
    "poppins",
    "inter",
    "roboto",
    "montserrat",
  ];

  Quill.register(Font, true);

  // 📝 Quill Init
  useEffect(() => {
    if (!wrapperRef.current) return;

    wrapperRef.current.innerHTML = "";
    const editor = document.createElement("div");
    wrapperRef.current.append(editor);

    const q = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: [
          [{ font: Font.whitelist }],
          [{ size: ["small", false, "large", "huge"] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["blockquote", "code-block"],
          ["link", "image"],
          ["clean"],
        ],
      },
    });

    q.disable();
    q.setText("Loading document...");
    setQuill(q);
  }, []);

  // 📄 Load Doc
  useEffect(() => {
    if (!socket || !quill) return;

    socket.once("load-document", (doc) => {
      if (!doc) return;
      quill.setContents(doc.content);
      setTitle(doc.title || "Untitled Document");
      quill.enable();

      const text = quill.getText();
      setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
    });

    socket.emit("join-document", id);
  }, [socket, quill, id]);

  // ✍️ Send Changes
  useEffect(() => {
    if (!socket || !quill) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);

      const text = quill.getText();
      setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
    };

    quill.on("text-change", handler);
    return () => quill.off("text-change", handler);
  }, [socket, quill]);

  // 📥 Receive Changes
  useEffect(() => {
    if (!socket || !quill) return;

    socket.on("receive-changes", (delta) => {
      quill.updateContents(delta);
    });

    return () => socket.off("receive-changes");
  }, [socket, quill]);

  // 💾 Auto Save
  useEffect(() => {
    if (!socket || !quill) return;

    const interval = setInterval(() => {
      socket.emit("save-document", {
        content: quill.getContents(),
        title,
      });
    }, SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [socket, quill, title]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* 🔥 Header */}
      <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="w-full px-4 sm:px-8 lg:px-16 py-4">

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl sm:text-2xl lg:text-3xl font-semibold outline-none w-full bg-transparent"
          />

          <div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-2">
            <span>Auto Saved</span>
            <span>{wordCount} words</span>
          </div>

        </div>
      </div>

      {/* 🔥 Editor Area */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-10 py-6 sm:py-10 flex justify-center">

        <div className="bg-white w-full max-w-5xl rounded-lg sm:rounded-xl shadow-lg sm:shadow-2xl p-4 sm:p-8 lg:p-12">

          <div
            ref={wrapperRef}
            className="min-h-[60vh]"
          ></div>

        </div>

      </div>
    </div>
  );
}
