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
    return done(null, user.id);
  } catch (error) {
    return done(error);
  }
});

// Deserialize user by ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);
    if (!user) {
      return done({ message: "User not found" });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});
