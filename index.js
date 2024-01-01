var express = require("express");

const router = require("./routes/routes");
var app = express();
var server = app.listen(3000, function () {
  console.log("Listening to requests on port 3000");
});
app.use("/", router);
app.use(express.static("public"));

var io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

// Handle socket connections
io.on("connection", (socket) => {
  console.log("Made socket connection", socket.id);

  // Handle chat event
  socket.on("chat", function (data) {
    // Filter out empty messages
    if (!(data.handle == "") && !(data.message == "")) {
      io.sockets.emit("chat", data);
    }
  });

  // Handle typing event
  socket.on("typing", function (data) {
    // Filter out empty handles
    if (!(data.handle == "")) {
      socket.broadcast.emit("typing", data);
    }
  });
});
