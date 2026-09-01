import socket from "./services/socket";

socket.connect();

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  socket.emit("join-room", "test-room");
});

socket.on("user-joined", (data) => {
  console.log("Another user joined:", data);
});

socket.on("user-left", (data) => {
  console.log("User left:", data);
});