var http = require("http");
var fs = require("fs");
var index = fs.readFileSync("index.html");

const { SerialPort } = require("serialport");
const { DelimiterParser } = require("@serialport/parser-delimiter");

const port = new SerialPort({
  path: "/dev/tty.usbmodem14101",
  baudRate: 9600,
  dataBits: 8,
  parity: "none",
  stopBits: 1,
  flowControl: false,
});

const parser = port.pipe(new DelimiterParser({ delimiter: "\n" }));
parser.on("data", console.log); // emits data after every '\n'

const parsers = SerialPort.parsers;

// const parser = new parsers.Readline({
//     delimiter: '\r\n'
// });

port.pipe(parser);

// var app = http.createServer(function (req, res) {
//   res.writeHead(200, { "Content-Type": "text/html" });
//   res.end(index);
// });

var express = require("express");
var app = express();
var server = require("http").createServer();
var io = require("socket.io")(server);

io.on("connection", function (socket) {
  console.log("Node is listening to port");
});

parser.on("data", function (data) {
  console.log("Received data from port: " + data);

  io.emit("data", data);
});

app.engine("html", require("ejs").renderFile);
app.get("/index", function (req, res) {
  var name = "hello";
  res.render(__dirname + "/views/layout/index.html", { name: name });
});

app.listen(3000);
