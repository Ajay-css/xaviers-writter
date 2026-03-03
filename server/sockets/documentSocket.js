import Document from "../models/Document.js";

const users = {}; // socketId -> { user, docId }

const documentSocket = (io) => {
  io.on("connection", (socket) => {

    socket.on("join-document", async ({ docId, user }) => {
      socket.join(docId);
      users[socket.id] = { user, docId };

      const doc = await Document.findById(docId);
      socket.emit("load-document", doc);

      // Notify others in the room about the new user
      const roomUsers = Object.values(users)
        .filter(u => u.docId === docId)
        .map(u => u.user);
      io.to(docId).emit("update-presence", roomUsers);

      socket.on("send-changes", (delta) => {
        socket.to(docId).emit("receive-changes", delta);
      });

      socket.on("send-title", (title) => {
        socket.to(docId).emit("receive-title", title);
      });

      socket.on("save-document", async ({ content, title }) => {
        await Document.findByIdAndUpdate(docId, {
          content,
          title
        });
      });

      socket.on("disconnect", () => {
        const userData = users[socket.id];
        if (userData) {
          const { docId } = userData;
          delete users[socket.id];
          const roomUsers = Object.values(users)
            .filter(u => u.docId === docId)
            .map(u => u.user);
          io.to(docId).emit("update-presence", roomUsers);
        }
      });
    });
  });
};

export default documentSocket;