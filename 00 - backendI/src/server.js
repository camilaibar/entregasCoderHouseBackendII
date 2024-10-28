import express from "express";
import path from "path";
import exphbs from "express-handlebars";
import dotenv from "dotenv";
import logger from "morgan";

import router from "./routes/index.js";
import mongoDBConnection from "./config/mongoDBConfgig.js";

import hbsRouter from "./routes/hbsRouter.js";
import hbsHelpers from "./helpers/hbsHelpers.js";

import { Server } from "socket.io";

// Initializaion
dotenv.config();
const __dirname = path.resolve();
const app = express();

// Handlebars config
const hbs = exphbs.create({ helpers: hbsHelpers, defaultLayout: "main" });
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", __dirname + "/src/views");

// Middleware config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use("/static", express.static(__dirname + "/public"));
app.use("/api", router);
app.use("/handlebars", hbsRouter);

// Connect DBs
mongoDBConnection();

// Endpoints
app.get("/", (req, res) => {
  res.send("Welcome to my first backend");
});

app.get("*", (req, res) => {
  res.send("That route is not valid, please try '/' instead");
});

// Server Run
const serverReference = app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});

// Socket.io config
const io = new Server(serverReference);

// Socket events
io.on("connection", (socket) => {
  console.log("New client connected with id: ", socket.id);

  socket.on("newProduct", () => {
    socket.emit("productListChange", {
      message: `Product list changed by user: ${socket.id}`,
    });
  });

  socket.on("postedMessage", () =>
    socketServer.emit("newMessage", {
      message: `User: ${socket.id}, posted a new message`,
    })
  );
});
