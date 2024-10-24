import jwt from "jsonwebtoken";

export const generateJWTToken = (user) => {
  const payload = {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    age: user.age,
  };

  return jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "20m",
  });
};

export const addJWTTokenToCookies = (res, user) => {
  const token = generateJWTToken(user);
  res.cookie("token", token, {
    httpOnly: true, // Secure cookie accessible only by the server
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
};
