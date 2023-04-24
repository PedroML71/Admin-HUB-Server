let io;

// inicializando socket.io
module.exports = {
  // funcão que inicia o socket;
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: "http://127.0.0.1:5173",
      },
    });

    return io;
  },

  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }

    return io;
  },
};
