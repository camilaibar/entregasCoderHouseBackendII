import { Router } from "express";
import passport from "passport";

import { addJWTTokenToCookies } from "../../utils/jwtUtils.js";

const router = Router();

router.get("/login", (req, res, next) => {
  return res.render("login");
});

router.get("/register", (req, res, next) => {
  return res.render("signup");
});

// Protect the profile route with JWT authentication from cookies
router.get(
  "/profile",
  passport.authenticate("jwt-cookies", {
    session: false,
    failureRedirect: "/hbs/login",
  }),
  (req, res) => {
    res.render("profile", {
      ...req.user, // This will contain user data if authentication succeeds
    });
  }
);

router.get("/", passport.authenticate("github"), (req, res, next) => {
  addJWTTokenToCookies(res, req.user); //When github is logged in, it redirects to here and we add the token to cookies
  return res.render("home", {
    ...req.user.toObject(),
  });
});

export default router;
