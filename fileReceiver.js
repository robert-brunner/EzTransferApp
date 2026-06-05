const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const {execSync} = require('child_process');

const PORT = 3000;


const getPicturesDir = () => {
        try {
        const result = execSync(
            'powershell -command "[Environment]::GetFolderPath(\'MyPictures\')"',
            { encoding: 'utf8' }
        ).trim();
        return result;
    } catch (e) {
        return path.join(os.homedir(), 'Pictures');
    }
}



const BASE_DIR = path.dirname(process.pkg ? process.execPath : __filename);
// Auto-detect local network IP
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

const HOST = getLocalIP();

// Save uploads in a "Received Files" folder next to the exe
// const TARGET_DIR = path.join(os.homedir(), "Pictures", "From Phone");
const TARGET_DIR = path.join(getPicturesDir(), 'From Phone');

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

const server = http.createServer((req, res) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "file-name, Content-Type",
    });
    return res.end();
  }

  if (req.method === "POST" && req.url === "/upload") {
    const rawFileName = req.headers["file-name"] || "uploaded_file";
    const fileName = decodeURIComponent(rawFileName);
    const filePath = path.join(TARGET_DIR, fileName);

    console.log("Saving:", filePath);

    const fileStream = fs.createWriteStream(filePath);
    req.pipe(fileStream);

    req.on("end", () => {
      res.writeHead(200, {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
      });
      res.end("File saved.");
    });

    req.on("error", (err) => {
      console.error("File write error:", err);
      res.writeHead(500);
      res.end("Server Error");
    });

    return;
  }

  // Serve static files (index.html etc)
//   let filePath = path.join(__dirname, req.url === "/" ? "index.html" : req.url);

let filePath = path.join(
    BASE_DIR,
    req.url === '/' ? 'index.html' : req.url
);

  const extname = path.extname(filePath);
  const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
  };
  const contentType = mimeTypes[extname] || "text/html";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end("Not Found");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("=================================");
  console.log(`  File Receiver is running!`);
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  Network: http://${HOST}:${PORT}`);
  console.log(`  Saving to: ${TARGET_DIR}`);
  console.log("=================================");
  console.log("On your phone, go to:");
  console.log(`  http://${HOST}:${PORT}`);
});
