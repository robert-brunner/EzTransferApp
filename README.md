# EzTransferApp

A lightweight local file transfer tool. Send photos, videos, PDFs, or any file from your phone (or any device) to your PC over your local network — no cloud, no accounts, no installs.

---

## How It Works

Your PC runs a small HTTP server. Any device on the same WiFi opens a browser, goes to the displayed URL, picks files, and hits Upload. Files land directly in your `Pictures/From Phone` folder.

---

## Requirements

- Node.js (to run from source)
- Both devices on the same local network

---

## Run from Source

```bash
node fileReceiver.js
```

The console will display your network URL, for example:

```
  Network: http://0.0.0.0:3000
```

On your phone, open that URL in any browser, pick your files, and hit Upload.

---

## Build a Standalone Exe (No Node Required on Target Machine)

Install pkg:

```bash
npm install -g pkg
```

Build:

```bash
pkg fileReceiver.js --target node18-win-x64 --output FileReceiver.exe
```

Distribute these two files together:

```
FileReceiver.exe
index.html
```

---

## Easy Launch (Windows)

Double-click `StartFileReceiver.bat` to start the server, or create a desktop shortcut to it.

---

## File Destination

Files are saved to the `Pictures/From Phone` folder of the logged-in user. The folder is created automatically if it doesn't exist.

On machines where Pictures is redirected (e.g. OneDrive), Windows is queried directly to find the correct path.
