import { Router } from "express";
import passport from "passport";

import { addJWTTokenToCookies, passportCall } from "../../utils/jwtUtils.js";

const router = Router();

router.get("/login", (req, res, next) => {
  return res.render("login");
});

router.get("/register", (req, res, next) => {
  return res.render("signup");
});

// Protect the profile route with JWT authentication from cookies
router.get("/profile", passportCall("jwt-cookies"), (req, res) => {
  res.render("profile", {
    ...req.user, // This will contain user data if authentication succeeds
  });
});

router.get("/", passport.authenticate("github"), (req, res, next) => {
  addJWTTokenToCookies(res, req.user); //When github is logged in, it redirects to here and we add the token to cookies
  return res.render("home", {
    ...req.user.toObject(),
  });
});

router.get("/products", (req, res, next) => {
  return res.render("products");
});

router.get("/cart", (req, res, next) => {
  return res.render("cart");
});

router.get("/purchase/:id", (req, res, next) => {
  return res.render("purchase");
});

export default router;
