import jwt from "jsonwebtoken";

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
