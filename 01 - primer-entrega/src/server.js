import express from "express";
import exphbs from "express-handlebars";
import "dotenv/config"; // For using variables on .env file
import cookieParser from "cookie-parser";
import passport from "passport";

import { dirname } from "../../backendI/src/utils/utils.js";
import router from "./routes/index.js";
import mongoDBConnection from "./config/mongoConfig.js";
import sessionConfig from "./config/sessionConfig.js";
import "./middlewares/passport/localStrategy.js"; // Run this as script on run
import "./middlewares/passport/githubStrategy.js"; // Run this as script on run
import "./middlewares/passport/googleStrategy.js"; // Run this as script on run
import "./middlewares/passport/jwtStrategy.js"; // Run this as script on run

// Initial config
const PORT = process.env.PORT;
const app = express();
mongoDBConnection();

// Configure handlebars
const hbs = exphbs.create({ defaultLayout: "main" });
app.engine("handlebars", hbs.engine);
app.set("views", dirname + "/src/views");
app.set("view engine", "handlebars");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sessionConfig); // All config related to session is defined in this router
app.use(passport.initialize()); // All endpoint will use passport, this must be defined before routes
app.use(passport.session()); // Link passport with express session
app.use("/static", express.static(dirname + "/public"));
app.use("/", router);

// Start app
app.listen(PORT, () => {
  console.log(`App running on port: ${PORT}`);
});

app.get("/login", (req, res) => {
  res.render("login");
});
