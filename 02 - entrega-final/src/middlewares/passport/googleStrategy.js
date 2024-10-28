import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../../dao/managers/users.manager.js";
import { createHash } from "../../utils/utils.js";

const strategyConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  scope: ["profile", "email"],
  state: true,
};

const signInAndUp = async (accessToken, refreshToken, profile, done) => {
  try {
    const { email, given_name, family_name } = profile._json;

    const user = await findUserByEmail(email);
    if (user)
      return done(
        null, // Error result
        user // For returning user info
      );

    // Create new user
    const password = await createHash(""); // As password is not managed by us, due to being connected to github, instead of changing the require option on user schema or creating a github schema for users, set a blank password by default for creating user, then the user can change it to connect without github

    const newUser = await createUser({
      first_name: given_name,
      last_name: family_name,
      email,
      password,
      isGoogle: true,
    });

    if (!newUser) return done("User not created");

    return done(
      null, // Error result
      newUser // For returning user info
    );
  } catch (error) {
    console.error(error);
    return done(error.message);
  }
};

passport.use("google", new GoogleStrategy(strategyConfig, signInAndUp));

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
