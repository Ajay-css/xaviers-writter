import express from "express";
import protect from "../middleware/protect.js";
import {
  createDocument,
  getUserDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
} from "../controllers/docController.js";

const router = express.Router();

router.post("/", protect, createDocument);
router.get("/", protect, getUserDocuments);
router.get("/:id", protect, getDocument);
router.put("/:id", protect, updateDocument);
router.delete("/:id", protect, deleteDocument);

export default router;
