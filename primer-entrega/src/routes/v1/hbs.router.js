import { Router } from "express";
import passport from "passport";

import { verifyJWTToken } from "../../middlewares/jwtAuth.js";
import { addJWTTokenToCookies } from "../../utils/jwtUtils.js";

const router = Router();

router.get("/login", (req, res, next) => {
  return res.render("login");
});

router.get("/register", (req, res, next) => {
  return res.render("signup");
});

router.get("/profile", verifyJWTToken, async (req, res, next) => {
  return res.render("profile", {
    ...req.user,
  });
});

router.get("/", passport.authenticate("github"), (req, res, next) => {
  addJWTTokenToCookies(res, req.user);
  return res.render("home", {
    ...req.user.toObject(),
  });
});

export default router;
