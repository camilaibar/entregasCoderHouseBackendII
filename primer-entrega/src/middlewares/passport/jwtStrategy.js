import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import {
  verifyJWTToken,
  extractJWTTokenFromCookies,
} from "../../utils/jwtUtils.js";

// Strategy to extract token from Authorization header
const strategyConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};

// Strategy to extract token from cookies
const strategyConfigCookies = {
  jwtFromRequest: ExtractJwt.fromExtractors([extractJWTTokenFromCookies]),
  secretOrKey: process.env.SECRET_KEY,
};

// Strategy for Bearer Token (from Authorization header)
passport.use("jwt", new JwtStrategy(strategyConfig, verifyJWTToken));

// Strategy for Cookies (using extracted token from cookies)
passport.use(
  "jwt-cookies",
  new JwtStrategy(strategyConfigCookies, verifyJWTToken)
);

// Serialize user ID for session
passport.serializeUser((user, done) => {
  try {
    if (!user || !user.id) {
      // If user object or ID is missing
      const error = new Error(
        "Invalid user object or missing user ID during serialization."
      );
      console.error("Serialize error:", error);
      return done(error);
    }
    return done(null, user.id);
  } catch (error) {
    console.error("Unexpected error in serializeUser:", error);
    return done(error);
  }
});

// Deserialize user by ID
passport.deserializeUser(async (id, done) => {
  try {
    if (!id) {
      // If ID is missing
      const error = new Error("User ID is missing for deserialization.");
      console.error("Deserialize error:", error);
      return done(error);
    }

    const user = await findUserById(id);
    if (!user) {
      // If user is not found in the database
      const error = new Error("User not found during deserialization.");
      console.warn("Deserialize warning:", error.message);
      return done(error);
    }

    return done(null, user);
  } catch (error) {
    console.error("Unexpected error in deserializeUser:", error);
    return done(error);
  }
});
