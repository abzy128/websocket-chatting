var message = document.getElementById("message");
var handle = document.getElementById("handle");
var button = document.getElementById("send-button");
var output = document.getElementById("chat-output");
var feedback = document.getElementById("chat-feedback");

var socket = io.connect("http://localhost:3000");

button.addEventListener("click", function () {
  socket.emit("chat", {
    message: message.value,
    handle: handle.value,
  });
});
message.addEventListener("keypress", function () {
  socket.emit("typing", handle.value);
});

socket.on("chat", function (data) {
  feedback.innerHTML = "";
  output.innerHTML +=
    "<p><strong>" + data.handle + ": </strong>" + data.message + "</p>";
});
socket.on("typing", function (data) {
  feedback.innerHTML = "<p><em>" + data + " is typing a message...</em></p>";
});

// var eventSource = new EventSource("/sse");

// eventSource.onmessage = function (event) {
//     if (event.data === "message") {
//         console.log("Received a message");
//     } else if (event.data === "typing") {
//         console.log("Someone is typing");
//     }
// };

// eventSource.onerror = function (error) {
//   console.log(error);
// };
// button.addEventListener("click", function () {
//   fetch("/chat?message=" + message.value + "&handle=" + handle.value);
// });
// message.addEventListener("keypress", function () {
//   fetch("/typing?handle=" + handle.value);
// });
