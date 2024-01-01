const express = require("express");
const app = express();
const router = express.Router();

// Routes
router.get("/hi", function (req, res) {
  res.send("hi");
});

router.get("/json", function (req, res) {
  res.json({ text: "hi", numbers: [1, 2, 3] });
});

router.get("/echo", function (req, res) {
  var text = req.query.text;
  if (req.query.format == "shouty") {
    text = text.toUpperCase();
  } else if (req.query.format == "character-count") {
    text = text + " has " + text.length + " characters";
  } else if (req.query.format == "backwards") {
    text = text.split("").reverse().join("");
  }
  res.send(text);
});

const filter = ["null", "undefined", ""];
// SSE Routes
router.get("/chat", function (req, res) {
  if (!(req.params.handle in filter) && !(req.params.message in filter)) {
    app.emit("message", req.params.message);
  }
  res.send("OK");
});
router.get("/typing", function (req, res) {
  if (!(req.params.handle in filter)) {
    app.emit("typing", req.params.handle);
  }
  res.send("OK");
});
router.get("/sse", function (req, res) {
  // Write SSE headers
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Content-Encoding": "none",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });
  // SSE event handling
  app.on("message", function (handle, message) {
    res.write("event: message\n");
    res.write(
      "data: " + JSON.stringify({ name: handle, message: message }) + "\n\n"
    );
  });
  app.on("typing", function (handle) {
    res.write("event: typing\n");
    res.write("data: " + JSON.stringify({ handle: handle }) + "\n\n");
  });
});
module.exports = router;
