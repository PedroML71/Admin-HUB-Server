const app = require("./app");
const bd = require("./models");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught Exception!!");

  process.exit(1);
});

const PORT = process.env.PORT || 8000;

bd.sequelize.sync().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });

  const io = require("./socket").init(server);

  io.on("connection", (socket) => {
    console.log(`Um cliente de socket-id: ${socket.id} se conectou`);

    socket.on("disconnect", () => {
      console.log("Um cliente se desconectou");
    });
  });

  process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    console.log("Unhandled Exception!!");

    server.close(() => {
      process.exit(1);
    });
  });
});
