import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, LogOut, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Dashboard() {
  const navigate = useNavigate();

  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Auth Check + Fetch
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      navigate("/login");
    } else {
      fetchDocs(storedToken);
    }
  }, []);

  // 📄 Fetch Documents
  const fetchDocs = async (authToken) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND}/api/docs`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      setDocs(res.data);
      setLoading(false); // ✅ stop loading

    } catch (err) {
      setLoading(false);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  // ➕ Create Document
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
      console.log(err);
    }
  };

  // 🗑 Delete Document
  const deleteDoc = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${import.meta.env.VITE_BACKEND}/api/docs/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchDocs(token); // ✅ refetch properly
    } catch (err) {
      console.log(err);
    }
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // 📄 Preview Extractor (Quill Delta Support)
  const getPreview = (content) => {
    if (!content) return "No content yet...";

    if (typeof content === "string") {
      return content.slice(0, 150);
    }

    if (content.ops) {
      const text = content.ops.map((op) => op.insert).join("");
      return text.slice(0, 150) || "Empty document...";
    }

    return "No preview available...";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* 🔥 Navbar */}
      <div className="flex justify-between items-center px-12 py-6 bg-white border-b shadow-sm">
        <div className="flex items-center gap-3">
          <FileText className="text-blue-600" size={28} />
          <h1 className="text-2xl font-bold text-gray-800">
            Xavier's Writer
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={createDoc}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white px-6 py-2.5 rounded-xl shadow-lg transition active:scale-95"
          >
            <Plus size={18} />
            New Document
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl transition active:scale-95"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* 🔥 Content */}
      <div className="p-12">

        {loading ? (
          <div className="text-center text-gray-500 text-lg">
            Loading documents...
          </div>
        ) : docs.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-32 text-gray-500">
            <FileText size={64} className="mb-6 opacity-40" />
            <h2 className="text-xl font-semibold mb-2">
              No documents yet
            </h2>
            <p className="mb-6">
              Create your first document to get started.
            </p>
            <button
              onClick={createDoc}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md transition"
            >
              Create Document
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
            {docs.map((doc, index) => (
              <motion.div
                key={doc._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl border hover:-translate-y-1 transition duration-300"
              >
                <h2 className="font-semibold text-gray-800 mb-3 truncate text-lg">
                  {doc.title || "Untitled Document"}
                </h2>

                <p className="text-sm text-gray-500 mb-4 h-16 overflow-hidden">
                  {getPreview(doc.content)}
                </p>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => navigate(`/editor/${doc._id}`)}
                    className="text-blue-600 font-medium hover:underline text-sm"
                  >
                    Open →
                  </button>

                  <button
                    onClick={() => deleteDoc(doc._id)}
                    className="text-red-500 hover:text-red-600 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="text-xs text-gray-400 mt-4">
                  {new Date(doc.updatedAt).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
