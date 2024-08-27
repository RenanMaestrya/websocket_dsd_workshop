import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const db = await open({
    filename: "chat.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_offset TEXT UNIQUE,
      content TEXT
    );
  `);

  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {
      maxDisconnectionDuration: 180000, // 3 minutes
    },
  });

  io.on("connection", async (socket) => {
    // Send missed messages to the client if it's a new connection
    const serverOffset = socket.handshake.auth.serverOffset || 0;
    try {
      const messages = await db.all(
        "SELECT id, content FROM messages WHERE id > ?",
        [serverOffset]
      );
      messages.forEach((message) => {
        socket.emit("chat message", message.content, message.id);
      });
    } catch (e) {
      console.error("Error sending missed messages:", e);
    }

    // Handle new chat messages
    socket.on("chat message", async (msg, clientOffset, callback) => {
      let result;
      try {
        result = await db.run(
          "INSERT INTO messages (content, client_offset) VALUES (?, ?)",
          msg,
          clientOffset
        );
        io.emit("chat message", msg, result.lastID);
      } catch (e) {
        if (e.errno === 19 /* SQLITE_CONSTRAINT */) {
          callback("Message already exists.");
        } else {
          console.error("Error storing message:", e);
          callback("Error storing message.");
        }
        return;
      }
      callback();
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "index.html"));
  });

  server.listen(3000, () => console.log("Running on: http://localhost:3000"));
}

main();
