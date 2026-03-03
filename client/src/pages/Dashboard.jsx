import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Plus, Trash2, LogOut, FileText, Search,
  Clock, User, ArrowRight
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const navigate = useNavigate();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!storedToken) {
      navigate("/login");
    } else {
      if (storedUser) setUser(JSON.parse(storedUser));
      fetchDocs(storedToken);
    }
  }, []);

  const fetchDocs = async (authToken) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND}/api/docs`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setDocs(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const createDoc = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND}/api/docs`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate(`/editor/${res.data._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteDoc = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_BACKEND}/api/docs/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDocs(docs.filter(doc => doc._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const filteredDocs = useMemo(() => {
    return docs.filter(doc =>
      doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof doc.content === 'string' && doc.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [docs, searchQuery]);

  // Extract plain text from content (handle JSON or HTML string)
  const getPreviewText = (content) => {
    if (!content) return "";
    if (typeof content === "string") {
      return content.replace(/<[^>]*>/g, "").trim();
    }
    // TipTap JSON content
    if (typeof content === "object") {
      const extractText = (node) => {
        if (!node) return "";
        if (node.type === "text") return node.text || "";
        if (node.content) return node.content.map(extractText).join(" ");
        return "";
      };
      return extractText(content).trim();
    }
    return "";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07 }
    }
  };

  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.35, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col overflow-hidden">

      {/* HEADER */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-12 flex-none">

        <div className="flex items-center gap-10">

          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white transition-all group-hover:scale-105">
              <FileText size={18} />
            </div>
            <span className="text-lg font-medium tracking-tight">
              Xaviers Writer
            </span>
          </Link>

          {/* Search */}
          <div className="hidden md:block relative w-80">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:bg-white transition-all text-sm font-medium"
            />
          </div>

        </div>

        {/* Right */}
        <div className="flex items-center gap-5">

          <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.name || "User"}</p>
              <p className="text-xs text-slate-400 font-medium">
                {user?.email}
              </p>
            </div>

            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
              {user?.name?.[0]?.toUpperCase() || <User size={16} />}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500 transition-all"
          >
            <LogOut size={18} />
          </button>

        </div>
      </header>


      {/* MAIN */}
      <main className="flex-1 overflow-auto px-6 md:px-12 py-10">

        <div className="max-w-7xl mx-auto">

          {/* Top Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

            <div>
              <h2 className="text-2xl md:text-3xl font-medium mb-2">
                My Documents
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                Manage and organize your professional writing.
              </p>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={createDoc}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-all"
            >
              <Plus size={18} />
              New Document
            </motion.button>

          </div>


          {/* LOADING */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 rounded-2xl bg-slate-100 animate-pulse border border-slate-200" />
              ))}
            </div>
          ) : filteredDocs.length > 0 ? (

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {filteredDocs.map((doc) => {
                  const previewText = getPreviewText(doc.content);

                  return (
                    <motion.div
                      key={doc._id}
                      variants={itemVariants}
                      layout
                      onClick={() => navigate(`/editor/${doc._id}`)}
                      className="group relative bg-white border border-slate-200 rounded-2xl cursor-pointer hover:border-blue-200 hover:shadow-md transition-all flex flex-col overflow-hidden"
                    >

                      {/* Delete */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <button
                          onClick={(e) => deleteDoc(doc._id, e)}
                          className="p-1.5 bg-white border border-slate-200 hover:border-rose-200 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Preview */}
                      <div className="h-40 bg-slate-50 border-b border-slate-200 flex items-center justify-center relative">

                        <div className="w-24 h-32 bg-white border border-slate-200 rounded-md shadow-sm p-3 flex flex-col gap-1 overflow-hidden">

                          <div className="h-2 bg-slate-700 rounded w-3/4 mb-1" />

                          {[80, 65, 75, 55, 70].map((w, i) => (
                            <div key={i} className="h-1 bg-slate-200 rounded" style={{ width: `${w}%` }} />
                          ))}

                        </div>

                      </div>

                      {/* Body */}
                      <div className="p-4 flex flex-col gap-3 flex-1">

                        <div>
                          <h3 className="text-sm font-medium line-clamp-1 mb-1">
                            {doc.title || "Untitled Document"}
                          </h3>

                          <p className="text-xs text-slate-500 font-medium line-clamp-2">
                            {previewText || "No content yet."}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">

                          <div className="flex items-center gap-1 text-slate-400">
                            <Clock size={12} />
                            <span className="text-xs font-medium">
                              {new Date(doc.updatedAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>

                          <div className="text-blue-600 text-xs font-medium opacity-0 group-hover:opacity-100 transition-all">
                            Open →
                          </div>

                        </div>

                      </div>

                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>

          ) : (

            <div className="flex flex-col items-center justify-center py-28 border border-dashed border-slate-300 rounded-2xl text-center bg-white">

              <FileText size={36} className="text-slate-300 mb-5" />

              <h3 className="text-lg font-medium mb-2">
                No documents yet
              </h3>

              <p className="text-sm text-slate-500 font-medium mb-6 max-w-xs">
                Create your first document and start writing something amazing.
              </p>

              <button
                onClick={createDoc}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-all"
              >
                Create Document
              </button>

            </div>

          )}

        </div>
      </main>

    </div>
  )
}
