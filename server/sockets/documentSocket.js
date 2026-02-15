import Document from "../models/Document.js";

const documentSocket = (io) => {
  io.on("connection", (socket) => {

    socket.on("join-document", async (docId) => {
      socket.join(docId);

      const doc = await Document.findById(docId);
      socket.emit("load-document", doc);

      socket.on("send-changes", (delta) => {
        socket.to(docId).emit("receive-changes", delta);
      });

      socket.on("save-document", async ({ content, title }) => {
        await Document.findByIdAndUpdate(docId, {
          content,
          title
        });
      });

    });

  });
};

export default documentSocket;