import passport from "passport";
import { Strategy as GithubStrategy } from "passport-github2";

import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../../dao/managers/users.manager.js";
import { createHash } from "../../utils/utils.js";

const strategyConfig = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
};

const signInAndUp = async (accessToken, refreshToken, profile, done) => {
  try {
    const { email, name } = profile._json;

    const user = await findUserByEmail(email);
    if (user)
      return done(
        null, // Error result
        user // For returning user info
      );

    // Create new user
    const [last_name, first_name] = name
      .split(",")
      .map((section) => section.trim());
    const password = await createHash(""); // As password is not managed by us, due to being connected to github, instead of changing the require option on user schema or creating a github schema for users, set a blank password by default for creating user, then the user can change it to connect without github

    const newUser = await createUser({
      first_name,
      last_name,
      email,
      password,
      isGithub: true,
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

passport.use("github", new GithubStrategy(strategyConfig, signInAndUp));

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
