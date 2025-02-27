#!/usr/bin/env node
const http = require("http")
const handleRequest = (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" })
  res.write("Good afternoon!")
  res.end()
};
const server = http.createServer(handleRequest)
server.listen(3000);
