import jwt from "jsonwebtoken";
import passport from "passport";

// Function to generate a JWT token for a user
export const generateJWTToken = (user) => {
  const payload = {
    id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    age: user.age,
  };

  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "20m" });
};

// Function to verify a JWT token (used by Passport or other middleware)
export const verifyJWTToken = (jwt_payload, done) => {
  if (!jwt_payload) {
    return done(null, false, { message: "User not found" });
  }
  return done(null, jwt_payload);
};

// Function to add JWT to cookies
export const addJWTTokenToCookies = (res, user) => {
  const token = generateJWTToken(user);
  res.cookie("token", token, {
    httpOnly: true, // Makes the cookie inaccessible via JavaScript
    maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
  });
};

// Function to extract JWT token from cookies
export const extractJWTTokenFromCookies = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return null;
  }

  return token;
};

// Custom handler for passport authentication and errors
export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (err, user, info) => {
      // Capture any error returned by 'done' in the passport strategy
      if (err) return next(err);

      // Capture custom messages set in the strategy callback's 'done' function
      if (!user) {
        return res.status(401).json({
          message: info.messages ? info.messages : info.toString(),
        });
      }

      // Attach the authenticated user to the request and proceed
      req.user = user;
      next();
    })(req, res, next);
  };
};

export const roleAuthorization = (requiredRole) => {
  return (req, res, next) => {
    // Check if the user object is present
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if the user's role matches the required role
    if (req.user.role !== requiredRole) {
      return res
        .status(403)
        .json({ error: "Forbidden: You do not have the required role" });
    }

    // Role matches, proceed to the next middleware
    next();
  };
};
