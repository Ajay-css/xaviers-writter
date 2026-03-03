import Document from "../models/Document.js";

/* CREATE */
export const createDocument = async (req, res) => {
  const doc = await Document.create({
    title: "Untitled Document",
    content: { ops: [{ insert: "\n" }] }, // 🔥 important
    owner: req.user,
  });

  res.json(doc);
};

/* GET ALL USER DOCS */
export const getUserDocuments = async (req, res) => {
  const docs = await Document.find({ owner: req.user }).sort({
    createdAt: -1,
  });

  res.json(docs);
};

/* GET SINGLE */
export const getDocument = async (req, res) => {
  const doc = await Document.findOne({
    _id: req.params.id,
    owner: req.user,
  });

  if (!doc)
    return res.status(404).json({ message: "Not found" });

  res.json(doc);
};

/* UPDATE */
export const updateDocument = async (req, res) => {
  const doc = await Document.findOneAndUpdate(
    { _id: req.params.id, owner: req.user },
    req.body,
    { new: true }
  );

  res.json(doc);
};

/* DELETE */
export const deleteDocument = async (req, res) => {
  await Document.findOneAndDelete({
    _id: req.params.id,
    owner: req.user,
  });

  res.json({ success: true });
};
