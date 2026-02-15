import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Untitled Document",
  },
  content: {
    type: mongoose.Schema.Types.Mixed,   // 🔥 change from String → Object
    default: {},
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

export default mongoose.model("Document", documentSchema);
