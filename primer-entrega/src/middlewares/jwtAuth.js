import jwt from "jsonwebtoken";

export const verifyJWTToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect("/hbs/login");
    }

    const decodedUser = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decodedUser; // Attach decoded user info to the request
    return next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid or expired token" });
  }
};
