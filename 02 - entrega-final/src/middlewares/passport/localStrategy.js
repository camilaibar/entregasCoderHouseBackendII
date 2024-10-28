import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../../dao/managers/users.manager.js";
import { createHash, isValidPassword } from "../../utils/utils.js";

const strategyConfig = {
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true,
};

const signup = async (req, email, password, done) => {
  try {
    const user = await findUserByEmail(email);
    if (user)
      return done(
        null, // Error result
        false, // For returning user info
        { message: "User exists" } // callback message
      );

    // Create new user
    let { first_name, last_name, email, age, password } = req.body;

    // Encript password
    password = await createHash(password);

    const newUser = await createUser({
      first_name,
      last_name,
      email,
      age,
      password,
    });

    if (!newUser) return done("User not created");

    return done(
      null, // Error result
      newUser, // For returning user info
      { message: "User created" } // callback message
    );
  } catch (error) {
    console.error(error);
    return done(error.message);
  }
};

const signin = async (req, email, password, done) => {
  try {
    // Check if user exists
    const user = await findUserByEmail(email);
    if (!user) {
      return done({ message: "Invalid user or password" });
    }

    // Check password of existing user
    const isMatch = await isValidPassword(password, user.password);
    if (!isMatch) {
      return done({ message: "Invalid user or password" });
    }

    return done(
      null, // Error result
      user, // For returning user info
      { message: "User logged in" } // callback message
    );
  } catch (error) {
    console.error(error);
    return done(error.message);
  }
};

const signinStrategy = new LocalStrategy(strategyConfig, signin);
const signupStrategy = new LocalStrategy(strategyConfig, signup);

passport.use("signin", signinStrategy);
passport.use("signup", signupStrategy);

passport.serializeUser((user, done) => {
  try {
    return done(null, user._id);
  } catch (error) {
    return done(error);
  }
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);
    if (!user) {
      return done({ message: "Invalid user or password" });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
});
