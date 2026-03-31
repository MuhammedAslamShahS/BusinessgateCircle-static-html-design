const http = require("http");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const host = "127.0.0.1";
const port = 8080;

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);

  if (urlPath === "/") {
    urlPath = "/index.html";
  } else if (urlPath.endsWith("/")) {
    urlPath += "index.html";
  }

  const requestedPath = path.join(root, urlPath.replace(/^\/+/, ""));
  const resolvedPath = path.resolve(requestedPath);

  if (!resolvedPath.startsWith(root)) {
    res.statusCode = 403;
    res.end("Forbidden");
    return;
  }

  fs.readFile(resolvedPath, (error, content) => {
    if (error) {
      res.statusCode = error.code === "ENOENT" ? 404 : 500;
      res.end(error.code === "ENOENT" ? "Not found" : "Server error");
      return;
    }

    const extension = path.extname(resolvedPath).toLowerCase();
    res.setHeader("Content-Type", mimeTypes[extension] || "application/octet-stream");
    res.end(content);
  });
});

server.listen(port, host, () => {
  console.log(`Static server running at http://${host}:${port}`);
});
