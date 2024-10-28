import { Router } from "express";
import session from "express-session";
import MongoStore from "connect-mongo";

const router = Router();

const sessionConnectionConfig = {
  store: MongoStore.create({
    mongoUrl:
      process.env.MONGO_CONNECTION_STRING ||
      "mongodb://localhost:27017/coderhouse",
    mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    ttl: 15,
    crypto: { secret: process.env.MONGO_SECRET },
  }),
  secret: process.env.MONGO_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 180000,
    //httpOnly: true, // Prevent access from JavaScript (for security)
    //secure: false, // Set to true if using HTTPS (set to true if your app uses HTTPS) , false by default
  },
};

router.use(session(sessionConnectionConfig));

export default router;
