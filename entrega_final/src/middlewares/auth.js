export const isAuth = (req, res, next) => {
  try {
    if (req.isAuthenticated()) return next();
    return res.status(403).json({ message: "Unouthorized" });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
